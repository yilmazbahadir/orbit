import { SignatureAlgorithm } from ".";
import * as crypto from "crypto";
import * as nacl from "tweetnacl";

export class Ed25519 implements SignatureAlgorithm {
  getPublicKey(privateKey: Buffer) {
    return Buffer.from(nacl.sign.keyPair.fromSeed(privateKey).publicKey);
  }

  hash(data: Buffer) {
    return crypto
      .createHash("sha256")
      .update(data)
      .digest();
  }

  sign(data: Buffer, privateKey: Buffer) {
    return Buffer.from(
      nacl.sign(data, nacl.sign.keyPair.fromSeed(privateKey).secretKey)
    );
  }
}
