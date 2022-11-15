import { Buffer } from "buffer";

export function encode(data: Buffer | Uint8Array): string {
  if (Buffer.isBuffer(data)) {
    return "0x" + data.toString("hex");
  }

  return data.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    "0x"
  );
}

export function decode(data: string): Buffer {
  if (data.indexOf("0x") === 0) {
    data = data.slice(2);
  }
  if (data.length % 2 === 1) {
    data = "0" + data;
  }

  return Buffer.from(data, "hex");
}
