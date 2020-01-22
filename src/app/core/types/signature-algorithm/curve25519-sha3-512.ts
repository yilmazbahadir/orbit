import { SignatureAlgorithm } from ".";
import { SHA3 } from "sha3";
import {
  KeyPair as Curve25519,
  SignSchema
} from "nem2-sdk/dist/src/core/crypto";

export class Curve25519_SHA3_512 implements SignatureAlgorithm {
  getPublicKey(privateKey: Buffer) {
    return Buffer.from(
      Curve25519.createKeyPairFromPrivateKeyString(
        privateKey.toString("hex"),
        SignSchema.SHA3
      ).publicKey
    );
  }

  hash(data: Buffer) {
    return new SHA3(256).update(data).digest();
  }

  sign(data: Buffer, privateKey: Buffer) {
    return Buffer.from(
      Curve25519.sign(
        Curve25519.createKeyPairFromPrivateKeyString(
          privateKey.toString("hex"),
          SignSchema.SHA3
        ),
        data,
        SignSchema.SHA3
      )
    );
  }
}
