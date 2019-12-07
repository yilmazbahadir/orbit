import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Key, HashTypes, SignatureTypes } from '../../../types/key';
import { HashService } from '../../core/services/hash.service';
import { SignatureService } from '../../core/services/signature.service';
import { KeyService } from '../../core/services/key.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  forms: {
    name: string;
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

  constructor(private key: KeyService, private hash: HashService, private signature: SignatureService) {
    this.forms = {
      name: "",
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

  coinTypeChange(coinType: number) {}

  submit() {
    const key: Key = {
      id: "",
      name: this.forms.name,
      public_key: "",
      mnemonic: this.forms.mnemonic,
      coin_type: this.forms.coinType,
      account: this.forms.account,
      change: this.forms.change,
      address_index: this.forms.addressIndex,
      hash_type: this.forms.hashType,
      signature_type: this.forms.signatureType, 
    }
    if(this.forms.password) {
      const passwordHexString = new Buffer(this.forms.password).toString("hex")
      key.hashed_password = this.hash.hash(passwordHexString, key.hash_type)
    }
    //public
  }
}
