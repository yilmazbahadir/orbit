import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { Request } from "../core/types/request";
import { KeyService } from "../core/services/key.service";
import { Key } from "src/app/core/types/key";
import { SignatureAlgorithm } from "../core/types/signature-algorithm";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"]
})
export class RequestComponent implements OnInit {
  request?: Request;
  key?: Key;

  constructor(
    private _key: KeyService,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

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

  onClickReject() {
    this.request!.callback(false);
  }

  onSubmit(password: string) {
    if (this.key && this.key.password) {
      const signatureAlgorithm = SignatureAlgorithm.create(
        this.key.signature_type
      );
      const hash = this._key
        .getPasswordHash(signatureAlgorithm, password, this.key.password.salt)
        .toString("hex");
      if (hash !== this.key.password.hash) {
        this.snackBar.open("Inalid password", undefined, { duration: 6000 });
        return;
      }
    }

    this.request!.callback(true);
  }
}
