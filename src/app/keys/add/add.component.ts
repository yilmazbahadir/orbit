import { Component, OnInit } from "@angular/core";
import { SignatureTypes, CoinTypes } from "../../core/types/key";
import { KeyService } from "../../core/services/key.service";
import * as bip39 from "bip39";
import { Router } from "@angular/router";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  forms: {
    id: string;
    mnemonic: string;
    coinType: CoinTypes;
    account: string;
    change: number;
    addressIndex: string;
    signatureType: SignatureTypes;
    password: string;
    isPasswordVisible: boolean;
  };
  coinTypes: CoinTypes[];
  signatureTypes: SignatureTypes[];

  constructor(private router: Router, private key: KeyService) {
    this.forms = {
      id: "",
      mnemonic: "",
      coinType: CoinTypes.TESTNET,
      account: "0",
      change: 0,
      addressIndex: "0",
      signatureType: SignatureTypes.SECP256K1_SHA256,
      password: "",
      isPasswordVisible: false
    };
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
  }

  ngOnInit() {}

  changeCoinType() {
    switch (this.forms.coinType) {
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

  async submit() {
    await this.key.create(
      {
        id: this.forms.id,
        mnemonic: this.forms.mnemonic,
        coin_type: this.forms.coinType,
        account: Number(this.forms.account),
        change: this.forms.change,
        address_index: Number(this.forms.addressIndex),
        signature_type: this.forms.signatureType
      },
      this.forms.password
    );
    await this.router.navigate([""]);
  }

  generateMnemonic() {
    this.forms.mnemonic = bip39.generateMnemonic();
  }

  getCoinTypeString(coinType: CoinTypes) {
    return this.key.getCoinTypeString(coinType);
  }

  getChangeString(change: number) {
    return this.key.getChangeString(change);
  }
}
