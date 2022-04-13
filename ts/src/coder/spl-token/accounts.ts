import * as BufferLayout from "buffer-layout";
import * as borsh from "@project-serum/borsh";
import { coption } from "./buffer-layout.js";
import { AccountsCoder } from "../index.js";
import { Idl, IdlTypeDef } from "../../idl.js";
import { accountSize } from "../common";

export class SplTokenAccountsCoder<A extends string = string>
  implements AccountsCoder
{
  constructor(private idl: Idl) {}

  public async encode<T = any>(accountName: A, account: T): Promise<Buffer> {
    switch (accountName) {
      case "token": {
        const buffer = Buffer.alloc(165);
        const len = TOKEN_ACCOUNT_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
      }
      case "mint": {
        const buffer = Buffer.alloc(82);
        const len = MINT_ACCOUNT_LAYOUT.encode(account, buffer);
        return buffer.slice(0, len);
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
      case "token": {
        return decodeTokenAccount(ix);
      }
      case "mint": {
        return decodeMintAccount(ix);
      }
      default: {
        throw new Error(`Invalid account name: ${accountName}`);
      }
    }
  }

  // TODO: this won't use the appendData.
  public memcmp(accountName: A, _appendData?: Buffer): any {
    switch (accountName) {
      case "token": {
        return {
          dataSize: 165,
        };
      }
      case "mint": {
        return {
          dataSize: 82,
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

function decodeMintAccount<T = any>(ix: Buffer): T {
  return MINT_ACCOUNT_LAYOUT.decode(ix) as T;
}

function decodeTokenAccount<T = any>(ix: Buffer): T {
  return TOKEN_ACCOUNT_LAYOUT.decode(ix) as T;
}

const MINT_ACCOUNT_LAYOUT = BufferLayout.struct([
  coption(borsh.publicKey(), "mintAuthority"),
  borsh.u64("supply"),
  BufferLayout.u8("decimals"),
  borsh.bool("isInitialized"),
  coption(borsh.publicKey(), "freezeAuthority"),
]);

const TOKEN_ACCOUNT_LAYOUT = BufferLayout.struct([
  borsh.publicKey("mint"),
  borsh.publicKey("authority"),
  borsh.u64("amount"),
  coption(borsh.publicKey(), "delegate"),
  BufferLayout.u8("state"),
  coption(borsh.u64(), "isNative"),
  borsh.u64("delegatedAmount"),
  coption(borsh.publicKey(), "closeAuthority"),
]);
