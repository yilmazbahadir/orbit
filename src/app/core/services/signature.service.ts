import { Injectable } from "@angular/core";
import * as secp256k1 from "tiny-secp256k1";
import { HashTypes, SignatureTypes } from "../../../types/key";
import * as nacl from "tweetnacl";

@Injectable({
  providedIn: "root"
})
export class SignatureService {
  constructor() {}

  signSecp256k1(hash: Buffer, privateKey: Buffer): Buffer {
    const signature = secp256k1.sign(hash, privateKey);

    return signature;
  }

  signEd25519(hash: Buffer, privateKey: Buffer): Buffer {
    const keypair = nacl.sign.keyPair.fromSeed(privateKey);
    const signature = Buffer.from(nacl.sign(hash, keypair.secretKey));

    return signature;
  }

  sign(hash: Buffer, signatureType: SignatureTypes, privateKey: Buffer) {
    switch (signatureType) {
      case SignatureTypes.SECP256K1:
        return this.signSecp256k1(hash, privateKey);
      case SignatureTypes.ED25519:
        return this.signEd25519(hash, privateKey);
      default:
        return new Buffer("");
    }
  }

  publicKeySecp256k1(privateKey: Buffer): Buffer {
    return secp256k1.pointFromScalar(privateKey)!;
  }

  publicKeyEd25519(privateKey: Buffer): Buffer {
    const keypair = nacl.sign.keyPair.fromSeed(privateKey);

    return Buffer.from(keypair.publicKey);
  }

  publicKey(signatureType: SignatureTypes, privateKey: Buffer) {
    switch (signatureType) {
      case SignatureTypes.SECP256K1:
        return this.publicKeySecp256k1(privateKey);
      case SignatureTypes.ED25519:
        return this.publicKeyEd25519(privateKey);
      default:
        return new Buffer("");
    }
  }
}
