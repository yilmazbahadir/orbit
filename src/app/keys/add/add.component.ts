import { Component, OnInit, ElementRef } from "@angular/core";
import { SignatureTypes, CoinTypes } from "../../core/types/key";
import { KeyService } from "../../core/services/key.service";
import * as bip39 from "bip39";
import { Router } from "@angular/router";
import { MatInput } from "@angular/material/input";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  coinTypes: CoinTypes[];
  signatureTypes: SignatureTypes[];

  isPasswordVisible: boolean;

  constructor(private router: Router, private key: KeyService) {
    this.coinTypes = [
      CoinTypes.BITCOIN,
      CoinTypes.TESTNET,
      CoinTypes.NEM,
      CoinTypes.ETHEREUM,
      CoinTypes.COSMOS
    ];
    this.signatureTypes = [
      SignatureTypes.SECP256K1_SHA256,
      SignatureTypes.ED25519,
      SignatureTypes.CURVE25519_KECCAK512,
      SignatureTypes.CURVE25519_SHA3_512
    ];
    this.isPasswordVisible = false;
  }

  ngOnInit() {}

  onChangeCoinType(coinType: CoinTypes) {
    switch (coinType) {
      case CoinTypes.BITCOIN:
        this.signatureTypes = [SignatureTypes.SECP256K1_SHA256];
        break;
      case CoinTypes.TESTNET:
        this.signatureTypes = [
          SignatureTypes.SECP256K1_SHA256,
          SignatureTypes.ED25519,
          SignatureTypes.CURVE25519_KECCAK512,
          SignatureTypes.CURVE25519_SHA3_512
        ];
        break;
      case CoinTypes.NEM:
        this.signatureTypes = [SignatureTypes.CURVE25519_KECCAK512];
        break;
      case CoinTypes.ETHEREUM:
        this.signatureTypes = [SignatureTypes.SECP256K1_SHA256];
        break;
      case CoinTypes.COSMOS:
        this.signatureTypes = [SignatureTypes.SECP256K1_SHA256];
        break;
    }
  }

  async onSubmit(
    id: string,
    mnemonic: string,
    coinType: CoinTypes,
    account: number,
    change: number,
    addressIndex: number,
    signatureType: SignatureTypes,
    password: string
  ) {
    await this.key.create(
      {
        id: id,
        mnemonic: mnemonic,
        coin_type: coinType,
        account: account,
        change: change,
        address_index: addressIndex,
        signature_type: signatureType
      },
      password
    );
    await this.router.navigate([""]);
  }

  onClickGenerateMnemonic(mnemonicElement: MatInput) {
    mnemonicElement.value = bip39.generateMnemonic();
  }

  getCoinTypeString(coinType: CoinTypes) {
    return this.key.getCoinTypeString(coinType);
  }

  getChangeString(change: number) {
    return this.key.getChangeString(change);
  }
}
