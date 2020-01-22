import { SignatureAlgorithm } from ".";
import { Keccak } from "sha3";
import {
  KeyPair as Curve25519,
  SignSchema
} from "nem2-sdk/dist/src/core/crypto";

export class Curve25519_Keccak512 implements SignatureAlgorithm {
  getPublicKey(privateKey: Buffer) {
    return Buffer.from(
      Curve25519.createKeyPairFromPrivateKeyString(
        privateKey.toString("hex"),
        SignSchema.KECCAK
      ).publicKey
    );
  }

  hash(data: Buffer) {
    return new Keccak(256).update(data).digest();
  }

  sign(data: Buffer, privateKey: Buffer) {
    return Buffer.from(
      Curve25519.sign(
        Curve25519.createKeyPairFromPrivateKeyString(
          privateKey.toString("hex"),
          SignSchema.KECCAK
        ),
        data,
        SignSchema.KECCAK
      )
    );
  }
}
