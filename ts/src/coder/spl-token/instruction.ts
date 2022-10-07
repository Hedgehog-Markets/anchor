import * as BufferLayout from "buffer-layout";
import * as borsh from "@project-serum/borsh";
import camelCase from "camelcase";
import { InstructionCoder } from "../index.js";
import { Idl } from "../../idl.js";

export class SplTokenInstructionCoder implements InstructionCoder {
  constructor(_: Idl) {}

  encode(ixName: string, ix: any): Buffer {
    switch (camelCase(ixName)) {
      case "initializeMint": {
        return encodeInitializeMint(ix);
      }
      case "initializeAccount": {
        return encodeInitializeAccount(ix);
      }
      case "initializeMultisig": {
        return encodeInitializeMultisig(ix);
      }
      case "transfer": {
        return encodeTransfer(ix);
      }
      case "approve": {
        return encodeApprove(ix);
      }
      case "revoke": {
        return encodeRevoke(ix);
      }
      case "setAuthority": {
        return encodeSetAuthority(ix);
      }
      case "mintTo": {
        return encodeMintTo(ix);
      }
      case "burn": {
        return encodeBurn(ix);
      }
      case "closeAccount": {
        return encodeCloseAccount(ix);
      }
      case "freezeAccount": {
        return encodeFreezeAccount(ix);
      }
      case "thawAccount": {
        return encodeThawAccount(ix);
      }
      case "transferChecked": {
        return encodeTransferChecked(ix);
      }
      case "approvedChecked": {
        return encodeApproveChecked(ix);
      }
      case "mintToChecked": {
        return encodeMintToChecked(ix);
      }
      case "burnChecked": {
        return encodeBurnChecked(ix);
      }
      case "intializeAccount2": {
        return encodeInitializeAccount2(ix);
      }
      case "syncNative": {
        return encodeSyncNative(ix);
      }
      case "initializeAccount3": {
        return encodeInitializeAccount3(ix);
      }
      case "initializeMultisig2": {
        return encodeInitializeMultisig2(ix);
      }
      case "initializeMint2": {
        return encodeInitializeMint2(ix);
      }
      default: {
        throw new Error(`Invalid instruction: ${ixName}`);
      }
    }
  }

  encodeState(_ixName: string, _ix: any): Buffer {
    throw new Error("SPL token does not have state");
  }
}

function encodeInitializeMint({
  decimals,
  mintAuthority,
  freezeAuthority,
}: any): Buffer {
  return encodeData({
    initializeMint: {
      decimals,
      mintAuthority,
      freezeAuthority,
    },
  });
}

function encodeInitializeAccount(_ix: any): Buffer {
  return encodeData({
    initializeAccount: {},
  });
}

function encodeInitializeMultisig({ m }: any): Buffer {
  return encodeData({
    initializeMultisig: {
      m,
    },
  });
}

function encodeTransfer({ amount }: any): Buffer {
  return encodeData({
    transfer: { amount },
  });
}

function encodeApprove({ amount }: any): Buffer {
  return encodeData({
    approve: { amount },
  });
}

function encodeRevoke(_ix: any): Buffer {
  return encodeData({
    revoke: {},
  });
}

function encodeSetAuthority({ authorityType, newAuthority }: any): Buffer {
  return encodeData({
    setAuthority: { authorityType, newAuthority },
  });
}

function encodeMintTo({ amount }: any): Buffer {
  return encodeData({
    mintTo: { amount },
  });
}

function encodeBurn({ amount }: any): Buffer {
  return encodeData({
    burn: { amount },
  });
}

function encodeCloseAccount(_: any): Buffer {
  return encodeData({
    closeAccount: {},
  });
}

function encodeFreezeAccount(_: any): Buffer {
  return encodeData({
    freezeAccount: {},
  });
}

function encodeThawAccount(_: any): Buffer {
  return encodeData({
    thawAccount: {},
  });
}

function encodeTransferChecked({ amount, decimals }: any): Buffer {
  return encodeData({
    transferChecked: { amount, decimals },
  });
}

function encodeApproveChecked({ amount, decimals }: any): Buffer {
  return encodeData({
    approveChecked: { amount, decimals },
  });
}

function encodeMintToChecked({ amount, decimals }: any): Buffer {
  return encodeData({
    mintToChecked: { amount, decimals },
  });
}

function encodeBurnChecked({ amount, decimals }: any): Buffer {
  return encodeData({
    burnChecked: { amount, decimals },
  });
}

function encodeInitializeAccount2({ authority }: any): Buffer {
  return encodeData({
    initilaizeAccount2: { authority },
  });
}

function encodeSyncNative(_: any): Buffer {
  return encodeData({
    syncNative: {},
  });
}

function encodeInitializeAccount3({ authority }: any): Buffer {
  return encodeData({
    initializeAccount3: { authority },
  });
}

function encodeInitializeMultisig2({ m }: any): Buffer {
  return encodeData({
    initializeMultisig2: { m },
  });
}

function encodeInitializeMint2({
  decimals,
  mintAuthority,
  freezeAuthority,
}: any): Buffer {
  return encodeData({
    initializeMint2: { decimals, mintAuthority, freezeAuthority },
  });
}

const LAYOUT = BufferLayout.union(BufferLayout.u8("instruction"));
LAYOUT.addVariant(
  0,
  BufferLayout.struct([
    BufferLayout.u8("decimals"),
    borsh.publicKey("mintAuthority"),
    borsh.option(borsh.publicKey(), "freezeAuthority"),
  ]),
  "initializeMint"
);
LAYOUT.addVariant(1, BufferLayout.struct([]), "initializeAccount");
LAYOUT.addVariant(
  2,
  BufferLayout.struct([BufferLayout.u8("m")]),
  "initializeMultisig"
);
LAYOUT.addVariant(3, BufferLayout.struct([borsh.u64("amount")]), "transfer");
LAYOUT.addVariant(4, BufferLayout.struct([borsh.u64("amount")]), "approve");
LAYOUT.addVariant(5, BufferLayout.struct([]), "revoke");
LAYOUT.addVariant(
  6,
  BufferLayout.struct([
    BufferLayout.u8("authorityType"),
    borsh.option(borsh.publicKey(), "newAuthority"),
  ]),
  "setAuthority"
);
LAYOUT.addVariant(7, BufferLayout.struct([borsh.u64("amount")]), "mintTo");
LAYOUT.addVariant(8, BufferLayout.struct([borsh.u64("amount")]), "burn");
LAYOUT.addVariant(9, BufferLayout.struct([]), "closeAccount");
LAYOUT.addVariant(10, BufferLayout.struct([]), "freezeAccount");
LAYOUT.addVariant(11, BufferLayout.struct([]), "thawAccount");
LAYOUT.addVariant(
  12,
  BufferLayout.struct([borsh.u64("amount"), BufferLayout.u8("decimals")]),
  "transferChecked"
);
LAYOUT.addVariant(
  13,
  BufferLayout.struct([borsh.u64("amount"), BufferLayout.u8("decimals")]),
  "approvedChecked"
);
LAYOUT.addVariant(
  14,
  BufferLayout.struct([borsh.u64("amount"), BufferLayout.u8("decimals")]),
  "mintToChecked"
);
LAYOUT.addVariant(
  15,
  BufferLayout.struct([borsh.u64("amount"), BufferLayout.u8("decimals")]),
  "burnedChecked"
);
LAYOUT.addVariant(
  16,
  BufferLayout.struct([borsh.publicKey("authority")]),
  "InitializeAccount2"
);
LAYOUT.addVariant(17, BufferLayout.struct([]), "syncNative");
LAYOUT.addVariant(
  18,
  BufferLayout.struct([borsh.publicKey("authority")]),
  "initializeAccount3"
);
LAYOUT.addVariant(
  19,
  BufferLayout.struct([BufferLayout.u8("m")]),
  "initializeMultisig2"
);
LAYOUT.addVariant(
  20,
  BufferLayout.struct([
    BufferLayout.u8("decimals"),
    borsh.publicKey("mintAuthority"),
    BufferLayout.u8("freezeAuthorityOption"),
    borsh.publicKey("freezeAuthority"),
  ]),
  "initializeMint2"
);

function encodeData(instruction: any): Buffer {
  let b = Buffer.alloc(instructionMaxSpan);
  let span = LAYOUT.encode(instruction, b);
  return b.slice(0, span);
}

const instructionMaxSpan = (() => {
  // Hacky approach to compute the max span of a layout.
  const computeMaxSpan = (layout: BufferLayout.Layout): number => {
    if (layout.span >= 0) {
      return layout.span;
    }

    if (layout instanceof BufferLayout.Structure) {
      return layout.fields.reduce(
        (acc, field) => acc + computeMaxSpan(field),
        0
      );
    } else if (layout instanceof BufferLayout.Union) {
      let span = Math.max(
        ...Object.values(layout.registry).map((variant) =>
          computeMaxSpan(variant)
        )
      );

      if (layout.usesPrefixDiscriminator) {
        span += (layout.discriminator as BufferLayout.UnionLayoutDiscriminator)
          .layout.span;
      }

      return span;
    } else if (layout instanceof BufferLayout.VariantLayout) {
      return layout.layout == null ? 0 : computeMaxSpan(layout.layout);
    } else if (
      "layout" in layout &&
      layout["layout"] instanceof BufferLayout.Layout &&
      "discriminator" in layout &&
      layout["discriminator"] instanceof BufferLayout.UInt
    ) {
      type OptionLayout = ReturnType<typeof borsh.option>;

      const opt = layout as OptionLayout;
      return computeMaxSpan(opt.discriminator) + computeMaxSpan(opt.layout);
    }

    throw new Error("indeterminate span");
  };

  return computeMaxSpan(LAYOUT);
})();
