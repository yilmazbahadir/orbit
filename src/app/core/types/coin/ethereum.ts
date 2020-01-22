import { Coin } from ".";
import { SignatureTypes, CoinTypes } from "../key";

export class Ethereum implements Coin {
  getCoinType() {
    return CoinTypes.ETHEREUM;
  }

  getSignatureTypes() {
    return [SignatureTypes.SECP256K1_SHA256];
  }

  getCoinTypeString() {
    return "60 Ethereum";
  }
}
