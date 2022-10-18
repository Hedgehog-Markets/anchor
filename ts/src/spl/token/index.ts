import { PublicKey } from "@solana/web3.js";
import { Program } from "../../program/index.js";
import Provider from "../../provider.js";
import { SplTokenCoder } from "../../coder/spl-token/index.js";

import { IDL, SplToken } from "./idl";
export { IDL, SplToken } from "./idl";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export function program(provider?: Provider): Program<SplToken> {
  return new Program<SplToken>(IDL, TOKEN_PROGRAM_ID, provider, coder());
}

export function coder(): SplTokenCoder {
  return new SplTokenCoder(IDL);
}
