import { Coin } from ".";
import { SignatureTypes, CoinTypes } from "../key";

export class Bitcoin implements Coin {
  getCoinType() {
    return CoinTypes.BITCOIN;
  }

  getSignatureTypes() {
    return [SignatureTypes.SECP256K1_SHA256];
  }

  getCoinTypeString() {
    return "0 Bitcoin";
  }
}
