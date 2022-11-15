import { Idl, IdlField, IdlTypeDef, IdlEnumVariant, IdlType } from "../idl.js";
import { IdlError } from "../error.js";
import * as BufferLayout from "buffer-layout";
import * as borsh from "@project-serum/borsh";

const isOptionLayout = (() => {
  type OptionLayout = ReturnType<typeof borsh.option>;

  return (layout: BufferLayout.Layout): layout is OptionLayout =>
    layout["layout"] instanceof BufferLayout.Layout &&
    layout["discriminator"] instanceof BufferLayout.UInt;
})();

const isWrappedLayout = (() => {
  interface WrappedLayout extends BufferLayout.Layout {
    layout: BufferLayout.Layout;
  }

  return (layout: BufferLayout.Layout): layout is WrappedLayout =>
    layout["layout"] instanceof BufferLayout.Layout &&
    typeof layout["decoder"] === "function" &&
    typeof layout["encoder"] === "function";
})();

export function layoutSize(layout: BufferLayout.Layout): number {
  if (layout.span >= 0) {
    return layout.span;
  }

  if (layout instanceof BufferLayout.Structure) {
    return layout.fields.reduce((acc, field) => acc + layoutSize(field), 0);
  } else if (layout instanceof BufferLayout.Union) {
    let span = Object.values(layout.registry).reduce((max, variant) => {
      const span = layoutSize(variant);
      return span > max ? span : max;
    }, 0);

    if (layout.usesPrefixDiscriminator) {
      span += (layout.discriminator as BufferLayout.UnionLayoutDiscriminator)
        .layout.span;
    }

    return span;
  } else if (layout instanceof BufferLayout.VariantLayout) {
    return layout.layout == null ? 0 : layoutSize(layout.layout);
  } else if (isOptionLayout(layout)) {
    return layoutSize(layout.discriminator) + layoutSize(layout.layout);
  } else if (isWrappedLayout(layout)) {
    return layoutSize(layout.layout);
  }

  throw new Error("indeterminate span");
}

export function accountSize(idl: Idl, idlAccount: IdlTypeDef): number {
  if (idlAccount.type.kind === "enum") {
    let variantSizes = idlAccount.type.variants.map(
      (variant: IdlEnumVariant) => {
        if (variant.fields === undefined) {
          return 0;
        }
        return variant.fields
          .map((f: IdlField | IdlType) => {
            if (!(typeof f === "object" && "name" in f)) {
              throw new Error("Tuple enum variants not yet implemented.");
            }
            return typeSize(idl, f.type);
          })
          .reduce((a: number, b: number) => a + b);
      }
    );
    return Math.max(...variantSizes) + 1;
  }
  if (idlAccount.type.fields === undefined) {
    return 0;
  }
  return idlAccount.type.fields
    .map((f) => typeSize(idl, f.type))
    .reduce((a, b) => a + b, 0);
}

// Returns the size of the type in bytes.
//
// For variable length types, just return 1.
// Users should override this value in such cases.
function typeSize(idl: Idl, ty: IdlType): number {
  switch (ty) {
    case "bool":
      return 1;
    case "u8":
    case "i8":
      return 1;
    case "i16":
    case "u16":
      return 2;
    case "u32":
    case "i32":
    case "f32":
      return 4;
    case "u64":
    case "i64":
    case "f64":
      return 8;
    case "u128":
    case "i128":
      return 16;
    case "bytes":
    case "string":
      return 1;
    case "publicKey":
      return 32;
    default:
      if ("vec" in ty) {
        return 1;
      }
      if ("option" in ty) {
        return 1 + typeSize(idl, ty.option);
      }
      if ("coption" in ty) {
        return 4 + typeSize(idl, ty.coption);
      }
      if ("defined" in ty) {
        const filtered = idl.types?.filter((t) => t.name === ty.defined) ?? [];
        if (filtered.length !== 1) {
          throw new IdlError(`Type not found: ${JSON.stringify(ty)}`);
        }
        let typeDef = filtered[0];

        return accountSize(idl, typeDef);
      }
      if ("array" in ty) {
        let arrayTy = ty.array[0];
        let arraySize = ty.array[1];
        return typeSize(idl, arrayTy) * arraySize;
      }
      throw new Error(`Invalid type ${JSON.stringify(ty)}`);
  }
}
