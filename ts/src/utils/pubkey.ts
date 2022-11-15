import { Buffer } from "buffer";
import { sha256 } from "js-sha256";
import { PublicKey } from "@solana/web3.js";
import { Address, translateAddress } from "../program/common.js";
import { toBuffer } from "./bytes/buffer.js";

// Sync version of web3.PublicKey.createWithSeed.
export function createWithSeedSync(
  fromPublicKey: PublicKey,
  seed: string,
  programId: PublicKey
): PublicKey {
  const buffer = Buffer.concat([
    fromPublicKey.toBuffer(),
    Buffer.from(seed),
    programId.toBuffer(),
  ]);
  return new PublicKey(sha256.digest(buffer));
}

// Sync version of web3.PublicKey.createProgramAddress.
export function createProgramAddressSync(
  seeds: Array<Buffer | Uint8Array>,
  programId: PublicKey
): PublicKey {
  const MAX_SEED_LENGTH = 32;

  let buffer = Buffer.alloc(0);
  seeds.forEach((seed) => {
    if (seed.length > MAX_SEED_LENGTH) {
      throw new TypeError(`Max seed length exceeded`);
    }
    buffer = Buffer.concat([buffer, toBuffer(seed)]);
  });
  buffer = Buffer.concat([
    buffer,
    programId.toBuffer(),
    Buffer.from("ProgramDerivedAddress"),
  ]);

  const key = new PublicKey(sha256.digest(buffer));
  if (PublicKey.isOnCurve(key)) {
    throw new Error(`Invalid seeds, address must fall off the curve`);
  }
  return key;
}

// Sync version of web3.PublicKey.findProgramAddress.
export function findProgramAddressSync(
  seeds: Array<Buffer | Uint8Array>,
  programId: PublicKey
): [PublicKey, number] {
  let nonce = 255;
  let address: PublicKey | undefined;
  while (nonce != 0) {
    try {
      const seedsWithNonce = seeds.concat(Buffer.from([nonce]));
      address = createProgramAddressSync(seedsWithNonce, programId);
    } catch (err) {
      if (err instanceof TypeError) {
        throw err;
      }
      nonce--;
      continue;
    }
    return [address, nonce];
  }
  throw new Error(`Unable to find a viable program address nonce`);
}

export async function associated(
  programId: Address,
  ...args: Array<Address | Buffer>
): Promise<PublicKey> {
  let seeds = [Buffer.from([97, 110, 99, 104, 111, 114])]; // b"anchor".
  args.forEach((arg) => {
    seeds.push(arg instanceof Buffer ? arg : translateAddress(arg).toBuffer());
  });
  const [assoc] = await PublicKey.findProgramAddress(
    seeds,
    translateAddress(programId)
  );
  return assoc;
}
