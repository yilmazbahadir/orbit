import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Key, HashTypes, SignatureTypes } from "../../../types/key";
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
  hashTypes$: BehaviorSubject<string[]>;
  signatureTypes$: BehaviorSubject<string[]>;

  constructor(
    private key: KeyService
  ) {
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
    this.hashTypes$ = new BehaviorSubject<string[]>([]);
    this.signatureTypes$ = new BehaviorSubject<string[]>([]);
  }
  ngOnInit() {}

  ngOnDestroy() {
    this.hashTypes$.complete();
    this.signatureTypes$.complete;
  }

  async submit() {
    await this.key.create(
      this.forms.id,
      this.forms.mnemonic,
      this.forms.coinType,
      this.forms.account,
      this.forms.change,
      this.forms.addressIndex,
      this.forms.hashType,
      this.forms.signatureType,
      this.forms.password
    )
  }

  generateMnemonic() {
    this.forms.mnemonic = bip39.generateMnemonic();
  }
}
