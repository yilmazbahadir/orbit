import { Coin } from ".";
import { SignatureTypes, CoinTypes } from "../key";

export class Cosmos implements Coin {
  getCoinType() {
    return CoinTypes.COSMOS;
  }

  getSignatureTypes() {
    return [SignatureTypes.SECP256K1_SHA256, SignatureTypes.ED25519];
  }

  getCoinTypeString() {
    return "118 Cosmos";
  }
}
