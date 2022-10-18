import { Buffer } from "buffer";
import { Layout } from "buffer-layout";
import { PACKET_DATA_SIZE } from "@solana/web3.js";
import { Idl } from "../../idl.js";
import { IdlCoder } from "./idl.js";
import { TypesCoder } from "../index.js";
import { layoutSize } from "../common.js";

/**
 * Encodes and decodes user-defined types.
 */
export class BorshTypesCoder<N extends string = string> implements TypesCoder {
  /**
   * Maps type name to a layout.
   */
  private typeLayouts: Map<N, [Layout, number | undefined]>;

  /**
   * IDL whose types will be coded.
   */
  private idl: Idl;

  public constructor(idl: Idl) {
    if (idl.types === undefined) {
      this.typeLayouts = new Map();
      return;
    }
    const layouts: [N, [Layout, number | undefined]][] = idl.types.map(
      (type) => {
        const layout = IdlCoder.typeDefLayout(type, idl.types);
        let size: number | undefined;
        try {
          size = layoutSize(layout);
        } catch (_) {
          // noop
        }
        return [type.name as N, [layout, size]];
      }
    );
    this.typeLayouts = new Map(layouts);
    this.idl = idl;
  }

  public encode<T = any>(typeName: N, type: T): Buffer {
    const entry = this.typeLayouts.get(typeName);
    if (!entry) {
      throw new Error(`Unknown type: ${typeName}`);
    }
    const [layout, size] = entry;
    const buffer = Buffer.alloc(size ?? PACKET_DATA_SIZE);
    const len = layout.encode(type, buffer);
    return buffer.subarray(0, len);
  }

  public decode<T = any>(typeName: N, typeData: Buffer): T {
    const entry = this.typeLayouts.get(typeName);
    if (!entry) {
      throw new Error(`Unknown type: ${typeName}`);
    }
    const [layout] = entry;
    return layout.decode(typeData);
  }
}
