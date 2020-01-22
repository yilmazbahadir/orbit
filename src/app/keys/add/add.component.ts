import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SignatureTypes, CoinTypes } from "../../core/types/key";
import { KeyService } from "../../core/services/key.service";
import * as bip39 from "bip39";
import { NgForm, NgModel } from "@angular/forms";
import { Coin } from "src/app/core/types/coin";

@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.css"]
})
export class AddComponent implements OnInit {
  coinTypes: CoinTypes[];
  signatureTypes: SignatureTypes[];

  isPasswordVisible: boolean;

  @ViewChild("form", { static: true })
  form!: NgForm;

  constructor(private router: Router, private key: KeyService) {
    this.coinTypes = Object.values(CoinTypes).filter(
      v => !isNaN(Number(v))
    ) as CoinTypes[];

    this.signatureTypes = Object.values(SignatureTypes);
    this.isPasswordVisible = false;
  }

  ngOnInit() {}

  onChangeCoinType(coinType: CoinTypes) {
    this.signatureTypes = Coin.create(coinType).getSignatureTypes();
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

  onClickGenerateMnemonic(mnemonicElement: NgModel) {
    const value = bip39.generateMnemonic();
    mnemonicElement.control.setValue(value);
  }

  getCoinTypeString(coinType: CoinTypes) {
    return Coin.create(coinType).getCoinTypeString();
  }

  getChangeString(change: number) {
    return this.key.getChangeString(change);
  }
}
