import { isBrowser } from "../common";

let encoder: TextEncoder;
let decoder: TextDecoder;

if (isBrowser) {
  // Browser https://caniuse.com/textencoder.
  encoder = new TextEncoder();
  decoder = new TextDecoder("utf-8");
} else {
  // Node.
  const util: typeof import("util") = require("util");
  encoder = new util.TextEncoder();
  decoder = new util.TextDecoder("utf-8") as TextDecoder;
}

export function decode(array: Buffer | Uint8Array): string {
  return decoder.decode(array);
}

export function encode(input: string): Buffer {
  const buf = encoder.encode(input);
  return Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
}
