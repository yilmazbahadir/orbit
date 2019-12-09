import { Component, OnInit } from "@angular/core";
import { HashTypes, SignatureTypes } from "../../../types/key";
import { KeyService } from "../../core/services/key.service";
import * as bip39 from "bip39";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  forms: {
    id: string;
    mnemonic: string;
    coinType: number;
    account: number;
    change: number;
    addressIndex: number;
    hashType: HashTypes;
    signatureType: SignatureTypes;
    password: string;
    isPasswordVisible: boolean;
  };
  hashTypes: HashTypes[];
  signatureTypes: SignatureTypes[];

  constructor(private key: KeyService) {
    this.forms = {
      id: "",
      mnemonic: "",
      coinType: 1,
      account: 0,
      change: 0,
      addressIndex: 0,
      hashType: HashTypes.SHA256,
      signatureType: SignatureTypes.SECP256K1,
      password: "",
      isPasswordVisible: false
    };
    this.hashTypes = [];
    this.signatureTypes = [];
  }
  ngOnInit() {}

  async submit() {
    await this.key.create(
      {
        id: this.forms.id,
        mnemonic: this.forms.mnemonic,
        coin_type: this.forms.coinType,
        account: this.forms.account,
        change: this.forms.change,
        address_index: this.forms.addressIndex,
        hash_type: this.forms.hashType,
        signature_type: this.forms.signatureType
      },
      this.forms.password
    );
  }

  generateMnemonic() {
    this.forms.mnemonic = bip39.generateMnemonic();
  }
}
