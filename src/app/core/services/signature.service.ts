import { Injectable } from "@angular/core";
import * as secp256k1 from "tiny-secp256k1";
import { HashTypes, SignatureTypes } from "../../../types/key";
import { HashService } from "./hash.service";

@Injectable({
  providedIn: "root"
})
export class SignatureService {
  constructor() {}

  signSecp256k1(hash: string, privateKey: Buffer): Buffer {
    const buffer = Buffer.from(hash, "hex");
    const signature = secp256k1.sign(buffer, privateKey);

    return signature;
  }

  sign(
    hash: string,
    signatureType: SignatureTypes,
    privateKey: Buffer
  ) {
    let signature: Buffer;
    switch (signatureType) {
      case SignatureTypes.SECP256K1:
        signature = this.signSecp256k1(hash, privateKey);
      default:
        signature = new Buffer("");
        break;
    }

    return signature;
  }

  publicKeySecp256k1(privateKey: Buffer): Buffer {
    return secp256k1.pointFromScalar(privateKey)!
  }

  publicKey(
    signatureType: SignatureTypes,
    privateKey: Buffer
  ) {
    let publicKey: Buffer;
    switch (signatureType) {
      case SignatureTypes.SECP256K1:
        publicKey = this.publicKeySecp256k1(privateKey);
      default:
        publicKey = new Buffer("");
        break;
    }

    return publicKey;
  }
}
