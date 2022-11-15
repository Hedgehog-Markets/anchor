import { AccountsCoder } from "../index.js";
import { Idl, IdlTypeDef } from "../../idl.js";
import * as BufferLayout from "buffer-layout";
import * as borsh from "@project-serum/borsh";
import { NONCE_ACCOUNT_LENGTH } from "@solana/web3.js";
import { accountSize } from "../common.js";
import BN from "bn.js";

export class SystemAccountsCoder<A extends string = string>
  implements AccountsCoder
{
  constructor(private idl: Idl) {}

  public async encode<T = any>(accountName: A, account: T): Promise<Buffer> {
    switch (accountName) {
      case "nonce": {
        const buffer = Buffer.alloc(NONCE_ACCOUNT_LENGTH);
        const len = NONCE_ACCOUNT_LAYOUT.encode(account as any, buffer);
        return buffer.subarray(0, len);
      }
      default: {
        throw new Error(`Invalid account name: ${accountName}`);
      }
    }
  }

  public decode<T = any>(accountName: A, ix: Buffer): T {
    return this.decodeUnchecked(accountName, ix);
  }

  public decodeUnchecked<T = any>(accountName: A, ix: Buffer): T {
    switch (accountName) {
      case "nonce": {
        return decodeNonceAccount(ix);
      }
      default: {
        throw new Error(`Invalid account name: ${accountName}`);
      }
    }
  }

  // TODO: this won't use the appendData.
  public memcmp(accountName: A, _appendData?: Buffer): any {
    switch (accountName) {
      case "nonce": {
        return {
          dataSize: NONCE_ACCOUNT_LENGTH,
        };
      }
      default: {
        throw new Error(`Invalid account name: ${accountName}`);
      }
    }
  }

  public size(idlAccount: IdlTypeDef): number {
    return accountSize(this.idl, idlAccount) ?? 0;
  }
}

function decodeNonceAccount<T = any>(ix: Buffer): T {
  return NONCE_ACCOUNT_LAYOUT.decode(ix) as T;
}

const NONCE_ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.u32("version"),
  BufferLayout.u32("state"),
  borsh.publicKey("authorizedPubkey"),
  borsh.publicKey("nonce"),
  BufferLayout.struct<{ lamportsPerSignature: BN }>(
    [borsh.u64("lamportsPerSignature")],
    "feeCalculator"
  ),
]);
