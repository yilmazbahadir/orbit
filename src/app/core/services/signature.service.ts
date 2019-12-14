import { Injectable } from "@angular/core";
import * as crypto from "crypto";
import * as secp256k1 from "tiny-secp256k1";
import * as nacl from "tweetnacl";
import { SignatureTypes } from "../../../types/key";
import { SHA3, Keccak } from "sha3";
import {
  KeyPair as Curve25519,
  SignSchema
} from "nem2-sdk/dist/src/core/crypto";

@Injectable({
  providedIn: "root"
})
export class SignatureService {
  constructor() {}

  hash256(data: Buffer, signatureType: SignatureTypes) {
    switch (signatureType) {
      case SignatureTypes.SECP256K1_SHA256:
      case SignatureTypes.ED25519:
        return crypto
          .createHash("sha256")
          .update(data)
          .digest();
      case SignatureTypes.CURVE25519_KECCAK512:
        return new Keccak(256).update(data).digest();
      case SignatureTypes.CURVE25519_SHA3_512:
        return new SHA3(256).update(data).digest();
      default:
        return new Buffer("");
    }
  }

  sign(
    data: Buffer,
    signatureType: SignatureTypes,
    privateKey: Buffer
  ): Buffer {
    switch (signatureType) {
      case SignatureTypes.SECP256K1_SHA256:
        return secp256k1.sign(
          crypto
            .createHash("sha256")
            .update(data)
            .digest(),
          privateKey
        );
      case SignatureTypes.ED25519:
        return Buffer.from(
          nacl.sign(data, nacl.sign.keyPair.fromSeed(privateKey).secretKey)
        );
      case SignatureTypes.CURVE25519_KECCAK512:
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
      case SignatureTypes.CURVE25519_SHA3_512:
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
      default:
        return new Buffer("");
    }
  }

  publicKey(signatureType: SignatureTypes, privateKey: Buffer) {
    switch (signatureType) {
      case SignatureTypes.SECP256K1_SHA256:
        return secp256k1.pointFromScalar(privateKey)!;
      case SignatureTypes.ED25519:
        return Buffer.from(nacl.sign.keyPair.fromSeed(privateKey).publicKey);
      case SignatureTypes.CURVE25519_KECCAK512:
        return Buffer.from(
          Curve25519.createKeyPairFromPrivateKeyString(
            privateKey.toString("hex"),
            SignSchema.KECCAK
          ).publicKey
        );
      case SignatureTypes.CURVE25519_SHA3_512:
        return Buffer.from(
          Curve25519.createKeyPairFromPrivateKeyString(
            privateKey.toString("hex"),
            SignSchema.SHA3
          ).publicKey
        );
      default:
        return new Buffer("");
    }
  }
}
