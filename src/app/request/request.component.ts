import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Request } from "../core/types/request";
import { KeyService } from "../core/services/key.service";
import { Key } from "src/app/core/types/key";
import { SignatureService } from '../core/services/signature.service';

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"]
})
export class RequestComponent implements OnInit {
  forms: {
    password: string;
  };
  request?: Request;
  key?: Key;

  constructor(
    private _key: KeyService,
    private signature: SignatureService,
    private cd: ChangeDetectorRef
  ) {
    this.forms = {
      password: ""
    };
  }

  ngOnInit() {
    chrome.tabs.getCurrent(async tab => {
      const background: any = chrome.extension.getBackgroundPage();
      this.request = background.window.orbit.requestsMap[tab!.id!];
      if (this.request && this.request.keyID) {
        this.key = await this._key.get(this.request.keyID);
      }
      this.cd.detectChanges();
    });
  }

  reject() {
    this.request!.callback(false);
  }

  confirm() {
    if (this.key && this.key.hashed_password) {
      const hash = this.signature.hash256(new Buffer(this.forms.password), this.key.signature_type).toString("hex");
      if (hash !== this.key.hashed_password) {
        return;
      }
    }

    this.request!.callback(true);
  }
}
