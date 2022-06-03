import { Buffer } from "buffer";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Wallet } from "./provider";
import { isBrowser } from "./utils/common";

export class BaseWallet implements Wallet {
  constructor(readonly payer: Keypair) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.partialSign(this.payer);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return txs.map((t) => {
      t.partialSign(this.payer);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey;
  }

  static local(): Wallet {
    if (!isBrowser) {
      const process = require("process");
      const payer = Keypair.fromSecretKey(
        Buffer.from(
          JSON.parse(
            require("fs").readFileSync(process.env.ANCHOR_WALLET, {
              encoding: "utf-8",
            })
          )
        )
      );
      return new BaseWallet(payer);
    }
    throw new Error("Local wallet not supported in browser");
  }
}
