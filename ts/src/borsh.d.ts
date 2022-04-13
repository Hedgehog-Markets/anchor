import "@project-serum/borsh";

import { Layout as BaseLayout, UInt } from "@solana/buffer-layout";

declare module "@project-serum/borsh" {
  export class Layout<T> extends BaseLayout<T> {}

  class OptionLayout<T> extends Layout<T | null> {
    layout: Layout<T>;
    discriminator: UInt;
  }

  export function option<T>(
    layout: Layout<T>,
    property?: string
  ): OptionLayout<T>;
}
