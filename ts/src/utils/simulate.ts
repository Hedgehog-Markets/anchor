import { Transaction, VersionedTransaction } from "@solana/web3.js";

import type {
  Commitment,
  Connection,
  PublicKey,
  RpcResponseAndContext,
  Signer,
  SimulatedTransactionResponse,
} from "@solana/web3.js";

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

  const message = tx.compileMessage();
  const signedKeys = message.accountKeys.slice(
    0,
    message.header.numRequiredSignatures
  );

  let signatures: Uint8Array[] | undefined = [];
  if (tx.signatures.length === signedKeys.length) {
    let i = 0;
    for (const { publicKey, signature } of tx.signatures) {
      if (signedKeys[i].equals(publicKey) && signature) {
        signatures.push(signature);
        i++;
      } else {
        signatures = undefined;
        break;
      }
    }
  }

  const vtx = new VersionedTransaction(message, signatures);

  let accounts: { encoding: "base64"; addresses: string[] } | undefined;
  if (includeAccounts) {
    accounts = {
      encoding: "base64",
      addresses: (Array.isArray(includeAccounts)
        ? includeAccounts
        : message.nonProgramIds()
      ).map((k) => k.toBase58()),
    };
  }

  return connection.simulateTransaction(vtx, {
    commitment,
    accounts,
    sigVerify: !!signers,
  });
}

export type SuccessfulTxSimulationResponse = Omit<
  SimulatedTransactionResponse,
  "err"
>;
