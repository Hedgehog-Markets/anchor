import bs58 from "bs58";

export function encode(data: Buffer | number[] | Uint8Array): string {
  return bs58.encode(data);
}

export function decode(data: string): Buffer {
  const buf = bs58.decode(data);
  return Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength);
}
