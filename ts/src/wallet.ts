import { Buffer } from "buffer";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Wallet as IWallet } from "./provider";
import { isBrowser } from "./utils/common";

export class Wallet implements IWallet {
  constructor(readonly payer: Keypair) {}

  static local(): Wallet | never {
    if (isBrowser) {
      throw new Error("Local wallet not supported in browser");
    }

    const process = require("process");

    if (!process.env.ANCHOR_WALLET || process.env.ANCHOR_WALLET === "") {
      throw new Error(
        "expected environment variable `ANCHOR_WALLET` is not set."
      );
    }

    const payer = Keypair.fromSecretKey(
      Buffer.from(
        JSON.parse(
          require("fs").readFileSync(process.env.ANCHOR_WALLET, {
            encoding: "utf-8",
          })
        )
      )
    );

    return new Wallet(payer);
  }

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
}