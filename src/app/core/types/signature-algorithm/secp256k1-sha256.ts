import { SignatureAlgorithm } from ".";
import * as crypto from "crypto";
import * as secp256k1 from "tiny-secp256k1";

export class Secp256k1_SHA256 implements SignatureAlgorithm {
  getPublicKey(privateKey: Buffer) {
    return secp256k1.pointFromScalar(privateKey) || new Buffer("");
  }

  hash(data: Buffer) {
    return crypto
      .createHash("sha256")
      .update(data)
      .digest();
  }

  sign(data: Buffer, privateKey: Buffer) {
    return secp256k1.sign(
      crypto
        .createHash("sha256")
        .update(data)
        .digest(),
      privateKey
    );
  }
}
