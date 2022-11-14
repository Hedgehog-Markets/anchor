import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { CamelCase } from "@juici/case";
import { Idl } from "../../";
import {
  IdlAccountDef,
  IdlEnumFields,
  IdlEnumFieldsNamed,
  IdlEnumFieldsTuple,
  IdlField,
  IdlInstruction,
  IdlType,
  IdlTypeDef,
  IdlTypeDefTyEnum,
  IdlTypeDefTyStruct,
} from "../../idl";
import { Accounts, Context } from "../context";
import { MethodsBuilder } from "./methods";

/**
 * All instructions for an IDL.
 */
export type AllInstructions<IDL extends Idl> = IDL["instructions"][number];

/**
 * Returns a type of instruction name to the IdlInstruction.
 */
export type InstructionMap<I extends IdlInstruction> = {
  [K in I["name"]]: I & { name: K };
};

/**
 * Returns a type of instruction name to the IdlInstruction.
 */
export type AllInstructionsMap<IDL extends Idl> = InstructionMap<
  AllInstructions<IDL>
>;

/**
 * All accounts for an IDL.
 */
export type AllAccounts<IDL extends Idl> =
  IDL["accounts"] extends IdlAccountDef[]
    ? IDL["accounts"][number]
    : IdlAccountDef;

/**
 * Returns a type of instruction name to the IdlInstruction.
 */
export type AccountMap<I extends IdlAccountDef> = {
  [K in I["name"]]: I & { name: K };
};

/**
 * Returns a type of instruction name to the IdlInstruction.
 */
export type AllAccountsMap<IDL extends Idl> = AccountMap<AllAccounts<IDL>>;

export type MakeInstructionsNamespace<
  IDL extends Idl,
  I extends IdlInstruction,
  Ret,
  Mk extends { [M in keyof InstructionMap<I>]: unknown } = {
    [M in keyof InstructionMap<I>]: unknown;
  }
> = {
  [M in keyof InstructionMap<I>]: InstructionContextFn<
    IDL,
    InstructionMap<I>[M],
    Ret
  > &
    Mk[M];
};

export type MakeMethodsNamespace<IDL extends Idl, I extends IdlInstruction> = {
  [M in keyof InstructionMap<I>]: MethodsFn<
    IDL,
    InstructionMap<I>[M],
    MethodsBuilder<IDL, InstructionMap<I>[M]>
  >;
};

export type InstructionContextFn<
  IDL extends Idl,
  I extends AllInstructions<IDL>,
  Ret
> = (...args: InstructionContextFnArgs<IDL, I>) => Ret;

export type InstructionContextFnArgs<
  IDL extends Idl,
  I extends IDL["instructions"][number]
> = [
  ...ArgsTuple<I["args"], IdlTypes<IDL>>,
  Context<Accounts<I["accounts"][number]>>
];

export type InstructionAccountAddresses<
  IDL extends Idl,
  I extends AllInstructions<IDL>
> = {
  [N in keyof Accounts<I["accounts"][number]>]: PublicKey;
};

export type MethodsFn<
  IDL extends Idl,
  I extends IDL["instructions"][number],
  Ret
> = (...args: ArgsTuple<I["args"], IdlTypes<IDL>>) => Ret;

type TypeMap = {
  publicKey: PublicKey;
  bool: boolean;
  string: string;
  bytes: Buffer;
} & {
  [K in "u8" | "i8" | "u16" | "i16" | "u32" | "i32" | "f32" | "f64"]: number;
} & {
  [K in "u64" | "i64" | "u128" | "i128"]: BN;
};

export type DecodeType<T extends IdlType, Defined> = T extends keyof TypeMap
  ? TypeMap[T]
  : T extends { defined: keyof Defined }
  ? Defined[T["defined"]]
  : T extends { option: { defined: keyof Defined } }
  ? Defined[T["option"]["defined"]] | null
  : T extends { option: keyof TypeMap }
  ? TypeMap[T["option"]] | null
  : T extends { coption: { defined: keyof Defined } }
  ? Defined[T["coption"]["defined"]] | null
  : T extends { coption: keyof TypeMap }
  ? TypeMap[T["coption"]] | null
  : T extends { vec: keyof TypeMap }
  ? TypeMap[T["vec"]][]
  : T extends { vec: { defined: keyof Defined } }
  ? Defined[T["vec"]["defined"]][]
  : T extends { array: [defined: keyof TypeMap, size: number] }
  ? TypeMap[T["array"][0]][]
  : unknown;

/**
 * Tuple of arguments.
 */
type ArgsTuple<A extends IdlField[], Defined> = {
  [K in keyof A]: A[K] extends IdlField
    ? DecodeType<A[K]["type"], Defined>
    : unknown;
} & unknown[];

/**
 * Flatten { a: number, b: { c: string } } into number | string
 */
type UnboxToUnion<T> = T extends (infer U)[]
  ? UnboxToUnion<U>
  : T extends Record<string, never> // empty object, eg: named enum variant without fields
  ? "__empty_object__"
  : T extends Record<string, infer V> // object with props, eg: struct
  ? UnboxToUnion<V>
  : T;

/**
 * Decode a single enum field.
 */
type DecodeEnumField<F, Defined> = F extends IdlType
  ? DecodeType<F, Defined>
  : never;

/**
 * Decode enum variant: named or tuple.
 */
type DecodeEnumFields<
  F extends IdlEnumFields,
  Defined
> = F extends IdlEnumFieldsNamed
  ? {
      [F2 in F[number] as F2["name"]]: DecodeEnumField<F2["type"], Defined>;
    }
  : F extends IdlEnumFieldsTuple
  ? {
      [F3 in keyof F as Exclude<F3, keyof unknown[]>]: DecodeEnumField<
        F[F3],
        Defined
      >;
    }
  : Record<never, never>;

type DecodeEnumVariants<I extends IdlTypeDefTyEnum, Defined> = {
  [V in I["variants"][number] as CamelCase<V["name"]>]: DecodeEnumFields<
    NonNullable<V["fields"]>,
    Defined
  >;
};

type ValueOf<T> = T[keyof T];
type XorEnumVariants<T extends Record<string, unknown>> = ValueOf<{
  [K1 in keyof T]: {
    [K2 in Exclude<keyof T, K1>]?: never;
  } & { [K2 in K1]: T[K2] };
}>;

type DecodeEnum<I extends IdlTypeDefTyEnum, Defined> = XorEnumVariants<
  DecodeEnumVariants<I, Defined>
>;

type DecodeStruct<I extends IdlTypeDefTyStruct, Defined> = {
  [T in I["fields"][number] as T["name"]]: DecodeType<T["type"], Defined>;
};

export type TypeDef<
  I extends IdlTypeDef,
  Defined
> = I["type"] extends IdlTypeDefTyEnum
  ? DecodeEnum<I["type"], Defined>
  : I["type"] extends IdlTypeDefTyStruct
  ? DecodeStruct<I["type"], Defined>
  : never;

type TypeDefDictionary<I extends IdlTypeDef[], Defined> = {
  [T in I[number] as T["name"]]: TypeDef<T, Defined>;
};

type DecodedHelper<T extends IdlTypeDef[], Defined> = {
  [D in T[number] as D["name"]]: TypeDef<D, Defined>;
};

type UnknownType = "__unkown_defined_type__";
type EmptyDefined = Record<UnknownType, never>;

type RecursiveTypes4<
  I extends IdlTypeDef[],
  Defined = EmptyDefined
> = DecodedHelper<I, Defined>;

type RecursiveTypes3<
  I extends IdlTypeDef[],
  Defined = EmptyDefined,
  Decoded = DecodedHelper<I, Defined>
> = UnknownType extends UnboxToUnion<Decoded>
  ? RecursiveTypes4<I, DecodedHelper<I, Defined>>
  : Decoded;

type RecursiveTypes2<
  I extends IdlTypeDef[],
  Defined = EmptyDefined,
  Decoded = DecodedHelper<I, Defined>
> = UnknownType extends UnboxToUnion<Decoded>
  ? RecursiveTypes3<I, DecodedHelper<I, Defined>>
  : Decoded;

type RecursiveTypes<
  I extends IdlTypeDef[],
  Defined = EmptyDefined,
  Decoded = DecodedHelper<I, Defined>
> = UnknownType extends UnboxToUnion<Decoded>
  ? RecursiveTypes2<I, DecodedHelper<I, Defined>>
  : Decoded;

export type IdlTypes<I extends Idl> = RecursiveTypes<NonNullable<I["types"]>>;

export type IdlAccounts<I extends Idl> = TypeDefDictionary<
  NonNullable<I["accounts"]>,
  IdlTypes<I>
>;

export type IdlEvents<I extends Idl, Defined = IdlTypes<I>> = {
  [E in NonNullable<I["events"]>[number] as E["name"]]: {
    [F in E["fields"][number] as F["name"]]: DecodeType<F["type"], Defined>;
  };
};

export type IdlErrorInfo<I extends Idl> = NonNullable<I["errors"]>[number];
