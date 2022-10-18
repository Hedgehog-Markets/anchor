import BN from "bn.js";
import * as BufferLayout from "buffer-layout";
import * as borsh from "@project-serum/borsh";
import { camelCase } from "@juici/case";
import { Idl } from "../../idl.js";
import { InstructionCoder } from "../index.js";
import { utf8 } from "../../utils/bytes/index.js";

export class SystemInstructionCoder implements InstructionCoder {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(_: Idl) {}

  encode(ixName: string, ix: any): Buffer {
    switch (camelCase(ixName)) {
      case "createAccount": {
        return encodeCreateAccount(ix);
      }
      case "assign": {
        return encodeAssign(ix);
      }
      case "transfer": {
        return encodeTransfer(ix);
      }
      case "createAccountWithSeed": {
        return encodeCreateAccountWithSeed(ix);
      }
      case "advanceNonceAccount": {
        return encodeAdvanceNonceAccount(ix);
      }
      case "withdrawNonceAccount": {
        return encodeWithdrawNonceAccount(ix);
      }
      case "initializeNonceAccount": {
        return encodeInitializeNonceAccount(ix);
      }
      case "authorizeNonceAccount": {
        return encodeAuthorizeNonceAccount(ix);
      }
      case "allocate": {
        return encodeAllocate(ix);
      }
      case "allocateWithSeed": {
        return encodeAllocateWithSeed(ix);
      }
      case "assignWithSeed": {
        return encodeAssignWithSeed(ix);
      }
      case "transferWithSeed": {
        return encodeTransferWithSeed(ix);
      }
      default: {
        throw new Error(`Invalid instruction: ${ixName}`);
      }
    }
  }

  encodeState(_ixName: string, _ix: any): Buffer {
    throw new Error("System does not have state");
  }
}

class RustStringLayout extends BufferLayout.Layout<string | null> {
  layout = BufferLayout.struct<
    Readonly<{
      length?: number;
      lengthPadding?: number;
      chars: Uint8Array;
    }>
  >(
    [
      BufferLayout.u32("length"),
      BufferLayout.u32("lengthPadding"),
      BufferLayout.blob(BufferLayout.offset(BufferLayout.u32(), -8), "chars"),
    ],
    this.property
  );

  constructor(public property?: string) {
    super(-1, property);
  }

  encode(src: string | null, b: Buffer, offset = 0): number {
    if (src === null || src === undefined) {
      return this.layout.span;
    }

    const data = {
      chars: Buffer.from(src, "utf-8"),
    };

    return this.layout.encode(data, b, offset);
  }

  decode(b: Buffer, offset = 0): string | null {
    const { chars } = this.layout.decode(b, offset);
    return utf8.decode(chars);
  }

  getSpan(b: Buffer, offset = 0): number {
    const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
    const len = view.getUint32(offset, true);
    return 8 + len;
  }
}

function rustStringLayout(property: string) {
  return new RustStringLayout(property);
}

function encodeCreateAccount({ lamports, space, owner }: any): Buffer {
  return encodeData({
    createAccount: { lamports, space, owner: owner.toBuffer() },
  });
}

function encodeAssign({ owner }: any): Buffer {
  return encodeData({
    assign: { owner: owner.toBuffer() },
  });
}

function encodeTransfer({ lamports }: any): Buffer {
  return encodeData({
    transfer: { lamports },
  });
}

function encodeCreateAccountWithSeed({
  base,
  seed,
  lamports,
  space,
  owner,
}: any): Buffer {
  return encodeData(
    {
      createAccountWithSeed: {
        base: base.toBuffer(),
        seed,
        lamports,
        space,
        owner: owner.toBuffer(),
      },
    },
    LAYOUT.getVariant(3)!.span + seed.length
  );
}

function encodeInitializeNonceAccount({ authorized }: any): Buffer {
  return encodeData({
    initializeNonceAccount: { authorized: authorized.toBuffer() },
  });
}

function encodeAdvanceNonceAccount({ authorized }: any): Buffer {
  return encodeData({
    advanceNonceAccount: { authorized: authorized.toBuffer() },
  });
}

function encodeWithdrawNonceAccount({ lamports }: any): Buffer {
  return encodeData({
    withdrawNonceAccount: { lamports },
  });
}

function encodeAuthorizeNonceAccount({ authorized }: any): Buffer {
  return encodeData({
    authorizeNonceAccount: { authorized: authorized.toBuffer() },
  });
}

function encodeAllocate({ space }: any): Buffer {
  return encodeData({
    allocate: { space },
  });
}

function encodeAllocateWithSeed({ base, seed, space, owner }: any): Buffer {
  return encodeData(
    {
      allocateWithSeed: {
        base: base.toBuffer(),
        seed,
        space,
        owner: owner.toBuffer(),
      },
    },
    LAYOUT.getVariant(9)!.span + seed.length
  );
}

function encodeAssignWithSeed({ base, seed, owner }: any): Buffer {
  return encodeData(
    {
      assignWithSeed: {
        base: base.toBuffer(),
        seed,
        owner: owner.toBuffer(),
      },
    },
    LAYOUT.getVariant(10)!.span + seed.length
  );
}

function encodeTransferWithSeed({ lamports, seed, owner }: any): Buffer {
  return encodeData(
    {
      transferWithSeed: {
        lamports,
        seed,
        owner: owner.toBuffer(),
      },
    },
    LAYOUT.getVariant(11)!.span + seed.length
  );
}

const LAYOUT = BufferLayout.union(BufferLayout.u32("instruction"));
LAYOUT.addVariant(
  0,
  BufferLayout.struct([
    borsh.u64("lamports"),
    borsh.u64("space"),
    borsh.publicKey("owner"),
  ]),
  "createAccount"
);
LAYOUT.addVariant(1, BufferLayout.struct([borsh.publicKey("owner")]), "assign");
LAYOUT.addVariant(2, BufferLayout.struct([borsh.u64("lamports")]), "transfer");
LAYOUT.addVariant(
  3,
  BufferLayout.struct([
    borsh.publicKey("base"),
    rustStringLayout("seed"),
    borsh.u64("lamports"),
    borsh.u64("space"),
    borsh.publicKey("owner"),
  ]),
  "createAccountWithSeed"
);
LAYOUT.addVariant(
  4,
  BufferLayout.struct([borsh.publicKey("authorized")]),
  "advanceNonceAccount"
);
LAYOUT.addVariant(
  5,
  BufferLayout.struct([borsh.u64("lamports")]),
  "withdrawNonceAccount"
);
LAYOUT.addVariant(
  6,
  BufferLayout.struct([borsh.publicKey("authorized")]),
  "initializeNonceAccount"
);
LAYOUT.addVariant(
  7,
  BufferLayout.struct([borsh.publicKey("authorized")]),
  "authorizeNonceAccount"
);
LAYOUT.addVariant(8, BufferLayout.struct([borsh.u64("space")]), "allocate");
LAYOUT.addVariant(
  9,
  BufferLayout.struct([
    borsh.publicKey("base"),
    rustStringLayout("seed"),
    borsh.u64("space"),
    borsh.publicKey("owner"),
  ]),
  "allocateWithSeed"
);
LAYOUT.addVariant(
  10,
  BufferLayout.struct([
    borsh.publicKey("base"),
    rustStringLayout("seed"),
    borsh.publicKey("owner"),
  ]),
  "assignWithSeed"
);
LAYOUT.addVariant(
  11,
  BufferLayout.struct([
    borsh.u64("lamports"),
    rustStringLayout("seed"),
    borsh.publicKey("owner"),
  ]),
  "transferWithSeed"
);

function encodeData(instruction: any, maxSpan?: number): Buffer {
  const b = Buffer.alloc(maxSpan ?? instructionMaxSpan);
  const span = LAYOUT.encode(instruction, b);

  if (maxSpan === undefined) {
    return b.subarray(0, span);
  }

  return b;
}

const instructionMaxSpan = Math.max(
  ...Object.values(LAYOUT.registry).map((r: any) => r.span)
);
