import * as BufferLayout from "buffer-layout";
import { Layout } from "buffer-layout";

export function coption<T>(
  layout: Layout<T>,
  property?: string
): Layout<T | null> {
  return new COptionLayout<T>(layout, property);
}

export class COptionLayout<T> extends Layout<T | null> {
  layout: Layout<T>;
  discriminator: Layout<number>;

  constructor(layout: Layout<T>, property?: string) {
    super(-1, property);
    this.layout = layout;
    this.discriminator = BufferLayout.u32();
  }

  encode(src: T | null, b: Buffer, offset = 0): number {
    if (src === null || src === undefined) {
      return this.layout.span + this.discriminator.encode(0, b, offset);
    }
    this.discriminator.encode(1, b, offset);
    return this.layout.encode(src, b, offset + 4) + 4;
  }

  decode(b: Buffer, offset = 0): T | null {
    const discriminator = this.discriminator.decode(b, offset);
    if (discriminator === 0) {
      return null;
    } else if (discriminator === 1) {
      return this.layout.decode(b, offset + 4);
    }
    throw new Error("Invalid coption " + this.layout.property);
  }

  getSpan(b: Buffer, offset = 0): number {
    return this.layout.getSpan(b, offset + 4) + 4;
  }
}
