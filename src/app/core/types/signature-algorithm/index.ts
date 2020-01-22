import { SignatureTypes } from "../key";
import { Secp256k1_SHA256 } from "./secp256k1-sha256";
import { Ed25519 } from "./ed25519";
import { Curve25519_Keccak512 } from "./curve25519-keccak512";
import { Curve25519_SHA3_512 } from "./curve25519-sha3-512";

export abstract class SignatureAlgorithm {
  abstract getPublicKey(privateKey: Buffer): Buffer;
  abstract hash(data: Buffer): Buffer;
  abstract sign(data: Buffer, privateKey: Buffer): Buffer;

  static create(signatureType: SignatureTypes): SignatureAlgorithm {
    switch (signatureType) {
      case SignatureTypes.SECP256K1_SHA256:
        return new Secp256k1_SHA256();
      case SignatureTypes.ED25519:
        return new Ed25519();
      case SignatureTypes.CURVE25519_KECCAK512:
        return new Curve25519_Keccak512();
      case SignatureTypes.CURVE25519_SHA3_512:
        return new Curve25519_SHA3_512();
    }
  }
}
