import { Coin } from ".";
import { SignatureTypes, CoinTypes } from "../key";

export class Nem implements Coin {
  getCoinType() {
    return CoinTypes.NEM;
  }

  getSignatureTypes() {
    return [SignatureTypes.CURVE25519_KECCAK512];
  }

  getCoinTypeString() {
    return "43 NEM";
  }
}
