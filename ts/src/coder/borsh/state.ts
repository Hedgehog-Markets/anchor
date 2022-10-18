import { Buffer } from "buffer";
import { Layout } from "buffer-layout";
import { sha256 } from "js-sha256";
import { Idl } from "../../idl.js";
import { IdlCoder } from "./idl.js";
import * as features from "../../utils/features.js";
import { layoutSize } from "../common.js";
import { PACKET_DATA_SIZE } from "@solana/web3.js";

export class BorshStateCoder {
  private layout: Layout;
  private maxSize: number | undefined;

  public constructor(idl: Idl) {
    if (idl.state === undefined) {
      throw new Error("Idl state not defined.");
    }
    this.layout = IdlCoder.typeDefLayout(idl.state.struct, idl.types);
    this.maxSize = layoutSize(this.layout);
  }

  public async encode<T = any>(name: string, account: T): Promise<Buffer> {
    const buffer = Buffer.alloc(this.maxSize ?? PACKET_DATA_SIZE);
    const len = this.layout.encode(account, buffer);

    const disc = await stateDiscriminator(name);
    const accData = buffer.subarray(0, len);

    return Buffer.concat([disc, accData]);
  }

  public decode<T = any>(ix: Buffer): T {
    // Chop off discriminator.
    const data = ix.subarray(8);
    return this.layout.decode(data);
  }
}

// Calculates unique 8 byte discriminator prepended to all anchor state accounts.
export async function stateDiscriminator(name: string): Promise<Buffer> {
  const ns = features.isSet("anchor-deprecated-state") ? "account" : "state";
  return Buffer.from(sha256.digest(`${ns}:${name}`)).subarray(0, 8);
}
