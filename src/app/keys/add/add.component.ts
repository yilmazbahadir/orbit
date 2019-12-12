import { Component, OnInit } from "@angular/core";
import { HashTypes, SignatureTypes, CoinTypes } from "../../../types/key";
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
    hashType: HashTypes;
    signatureType: SignatureTypes;
    password: string;
    isPasswordVisible: boolean;
  };
  coinTypes: CoinTypes[];
  hashTypes: HashTypes[];
  signatureTypes: SignatureTypes[];

  constructor(private router: Router, private key: KeyService) {
    this.forms = {
      id: "",
      mnemonic: "",
      coinType: CoinTypes.TESTNET,
      account: "0",
      change: 0,
      addressIndex: "0",
      hashType: HashTypes.SHA256,
      signatureType: SignatureTypes.SECP256K1,
      password: "",
      isPasswordVisible: false
    };
    this.coinTypes = [CoinTypes.BITCOIN, CoinTypes.TESTNET, CoinTypes.COSMOS];
    this.hashTypes = [HashTypes.SHA256, HashTypes.SHA3_256, HashTypes.KECCAK256];
    this.signatureTypes = [SignatureTypes.SECP256K1, SignatureTypes.ED25519];
  }

  ngOnInit() {}

  changeCoinType() {
    switch (this.forms.coinType) {
      case CoinTypes.BITCOIN:
        this.hashTypes = [HashTypes.SHA256];
        this.signatureTypes = [SignatureTypes.SECP256K1];
        break;
      case CoinTypes.TESTNET:
        this.hashTypes = [HashTypes.SHA256, HashTypes.SHA3_256, HashTypes.KECCAK256];
        this.signatureTypes = [SignatureTypes.SECP256K1, SignatureTypes.ED25519];
        break;
      case CoinTypes.COSMOS:
        this.hashTypes = [HashTypes.SHA256];
        this.signatureTypes = [SignatureTypes.SECP256K1];
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
        hash_type: this.forms.hashType,
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
