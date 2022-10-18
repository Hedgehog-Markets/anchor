import bs58 from "bs58";
import { Buffer } from "buffer";
import { Layout } from "buffer-layout";
import { pascalCase } from "@juici/case";
import { sha256 } from "js-sha256";
import { Idl, IdlTypeDef } from "../../idl.js";
import { IdlCoder } from "./idl.js";
import { AccountsCoder } from "../index.js";
import { accountSize, layoutSize } from "../common.js";
import { PACKET_DATA_SIZE } from "@solana/web3.js";

/**
 * Number of bytes of the account discriminator.
 */
export const ACCOUNT_DISCRIMINATOR_SIZE = 8;

/**
 * Encodes and decodes account objects.
 */
export class BorshAccountsCoder<A extends string = string>
  implements AccountsCoder
{
  /**
   * Maps account type identifier to a layout.
   */
  private accountLayouts: Map<A, [Layout, number | undefined]>;

  /**
   * IDL whose acconts will be coded.
   */
  private idl: Idl;

  public constructor(idl: Idl) {
    if (idl.accounts === undefined) {
      this.accountLayouts = new Map();
      return;
    }
    const layouts: [A, [Layout, number | undefined]][] = idl.accounts.map(
      (acc) => {
        const layout = IdlCoder.typeDefLayout(acc, idl.types);
        let size: number | undefined;
        try {
          size = layoutSize(layout);
        } catch (_) {
          // noop
        }
        return [acc.name as A, [layout, size]];
      }
    );

    this.accountLayouts = new Map(layouts);
    this.idl = idl;
  }

  public async encode<T = any>(accountName: A, account: T): Promise<Buffer> {
    const entry = this.accountLayouts.get(accountName);
    if (!entry) {
      throw new Error(`Unknown account: ${accountName}`);
    }
    const [layout, size] = entry;
    const buffer = Buffer.alloc(size ?? PACKET_DATA_SIZE);
    const len = layout.encode(account, buffer);
    const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
    return Buffer.concat([discriminator, buffer.subarray(0, len)]);
  }

  public decode<T = any>(accountName: A, data: Buffer): T {
    // Assert the account discriminator is correct.
    const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
    if (discriminator.compare(data.subarray(0, ACCOUNT_DISCRIMINATOR_SIZE))) {
      throw new Error("Invalid account discriminator");
    }
    return this.decodeUnchecked(accountName, data);
  }

  public decodeUnchecked<T = any>(accountName: A, ix: Buffer): T {
    const entry = this.accountLayouts.get(accountName);
    if (!entry) {
      throw new Error(`Unknown account: ${accountName}`);
    }
    const [layout] = entry;
    // Chop off the discriminator before decoding.
    return layout.decode(ix.subarray(ACCOUNT_DISCRIMINATOR_SIZE));
  }

  public memcmp(accountName: A, appendData?: Buffer): any {
    const discriminator = BorshAccountsCoder.accountDiscriminator(accountName);
    return {
      offset: 0,
      bytes: bs58.encode(
        appendData ? Buffer.concat([discriminator, appendData]) : discriminator
      ),
    };
  }

  public size(idlAccount: IdlTypeDef): number {
    return (
      ACCOUNT_DISCRIMINATOR_SIZE + (accountSize(this.idl, idlAccount) ?? 0)
    );
  }

  /**
   * Calculates and returns a unique 8 byte discriminator prepended to all anchor accounts.
   *
   * @param name The name of the account to calculate the discriminator.
   */
  public static accountDiscriminator(name: string): Buffer {
    const digest = sha256.arrayBuffer(`account:${pascalCase(name)}`);
    return Buffer.from(digest, 0, ACCOUNT_DISCRIMINATOR_SIZE);
  }
}
