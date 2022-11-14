import { SendTransactionError, Transaction } from "@solana/web3.js";

import type {
  Commitment,
  Connection,
  PublicKey,
  RpcResponseAndContext,
  Signer,
  SimulatedTransactionResponse,
} from "@solana/web3.js";
import {
  type as pick,
  number,
  string,
  array,
  boolean,
  literal,
  union,
  optional,
  nullable,
  coerce,
  create,
  unknown,
  any,
  Struct,
} from "superstruct";

declare module "@solana/web3.js" {
  interface Transaction {
    _compile(): Message;
    _serialize(signData: Buffer): Buffer;
  }
  interface Connection {
    _rpcRequest(method: string, args: Array<unknown>): Promise<unknown>;
  }
}

// copy from @solana/web3.js that has a commitment param
export async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  signers?: Array<Signer>,
  commitment?: Commitment,
  includeAccounts?: boolean | Array<PublicKey>
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  const tx = new Transaction();
  tx.feePayer = transaction.feePayer;
  tx.instructions = transaction.instructions;
  tx.nonceInfo = transaction.nonceInfo;
  tx.signatures = transaction.signatures;

  if (signers) {
    tx.sign(...signers);
  }

  const message = transaction._compile();
  const signData = message.serialize();
  const wireTransaction = transaction._serialize(signData);
  const encodedTransaction = wireTransaction.toString("base64");
  const config: Record<string, unknown> = {
    encoding: "base64",
    commitment: commitment ?? connection.commitment,
  };

  if (includeAccounts) {
    config.accounts = {
      encoding: "base64",
      addresses: (Array.isArray(includeAccounts)
        ? includeAccounts
        : message.nonProgramIds()
      ).map((k) => k.toBase58()),
    };
  }

  if (signers) {
    config.sigVerify = true;
  }

  const args = [encodedTransaction, config];
  const unsafeRes = await connection._rpcRequest("simulateTransaction", args);
  const res = create(unsafeRes, SimulatedTransactionResponseStruct);

  if ("error" in res) {
    let logs: Array<string> | undefined;
    if (
      "data" in res.error &&
      "logs" in res.error.data &&
      Array.isArray(res.error.data.logs)
    ) {
      logs = res.error.data.logs;
    }
    throw new SendTransactionError(
      `failed to simulate transaction: ${res.error.message}`,
      logs
    );
  }
  return res.result;
}

// copy from @solana/web3.js
function jsonRpcResult<T, U>(schema: Struct<T, U>) {
  return coerce(createRpcResult(schema), UnknownRpcResult, (value) => {
    if ("error" in value) {
      return value;
    } else {
      return {
        ...value,
        result: create(value.result, schema),
      };
    }
  });
}

// copy from @solana/web3.js
const UnknownRpcResult = createRpcResult(unknown());

// copy from @solana/web3.js
function createRpcResult<T, U>(result: Struct<T, U>) {
  return union([
    pick({
      jsonrpc: literal("2.0"),
      id: string(),
      result,
    }),
    pick({
      jsonrpc: literal("2.0"),
      id: string(),
      error: pick({
        code: unknown(),
        message: string(),
        data: optional(any()),
      }),
    }),
  ]);
}

// copy from @solana/web3.js
function jsonRpcResultAndContext<T, U>(value: Struct<T, U>) {
  return jsonRpcResult(
    pick({
      context: pick({
        slot: number(),
      }),
      value,
    })
  );
}

// copy from @solana/web3.js
const SimulatedTransactionResponseStruct = jsonRpcResultAndContext(
  pick({
    err: nullable(union([pick({}), string()])),
    logs: nullable(array(string())),
    accounts: optional(
      nullable(
        array(
          nullable(
            pick({
              executable: boolean(),
              owner: string(),
              lamports: number(),
              data: array(string()),
              rentEpoch: optional(number()),
            })
          )
        )
      )
    ),
    unitsConsumed: optional(number()),
  })
);

export type SuccessfulTxSimulationResponse = Omit<
  SimulatedTransactionResponse,
  "err"
>;
