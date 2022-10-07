declare module "buffer-layout" {
  import {
    Layout as BaseLayout,
    LayoutObject,
    Structure,
    Union,
    UnionDiscriminator,
    UInt,
    UIntBE,
  } from "@solana/buffer-layout";

  export * from "@solana/buffer-layout";

  export abstract class Layout<T = any> extends BaseLayout<T> {}

  export const struct: <T = LayoutObject>(
    fields: Layout<T[keyof T]>[],
    property?: string | undefined,
    decodePrefixes?: boolean | undefined
  ) => Structure<T>;
  export const union: (
    discr: Layout<LayoutObject> | UnionDiscriminator | UInt | UIntBE,
    defaultLayout?: Layout<LayoutObject> | undefined,
    property?: string | undefined
  ) => Union;
}
