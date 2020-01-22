import { Coin } from ".";
import { SignatureTypes, CoinTypes } from "../key";

export class Testnet implements Coin {
  getCoinType() {
    return CoinTypes.TESTNET;
  }

  getSignatureTypes() {
    return Object.values(SignatureTypes);
  }

  getCoinTypeString() {
    return "1 All Testnet";
  }
}
