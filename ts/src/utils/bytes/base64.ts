import { Buffer } from "buffer";
import * as base64 from "base64-js";

export function encode(data: Buffer | Uint8Array): string {
  return base64.fromByteArray(data);
}

export function decode(data: string): Buffer {
  const buf = base64.toByteArray(data);
  return Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
}
