import { SignatureTypes, CoinTypes } from "../key";
import { Bitcoin } from "./bitcoin";
import { Testnet } from "./testnet";
import { Nem } from "./nem";
import { Ethereum } from "./ethereum";
import { Cosmos } from './cosmos';

export abstract class Coin {
  abstract getCoinType(): CoinTypes;
  abstract getSignatureTypes(): SignatureTypes[];
  abstract getCoinTypeString(): string;

  static create(coinType: CoinTypes): Coin {
    switch (coinType) {
      case CoinTypes.BITCOIN:
        return new Bitcoin();
      case CoinTypes.TESTNET:
        return new Testnet();
      case CoinTypes.NEM:
        return new Nem();
      case CoinTypes.ETHEREUM:
        return new Ethereum();
      case CoinTypes.COSMOS:
        return new Cosmos();
    }
  }
}
