import { Component, OnInit } from "@angular/core";
import { Key } from "../core/types/key";
import { KeyService } from "../core/services/key.service";
import { from, Observable } from "rxjs";
import { SignatureService } from "../core/services/signature.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  keys$: Observable<Key[]>;

  constructor(private key: KeyService, private signature: SignatureService) {
    this.keys$ = from(this.key.all());
  }

  ngOnInit() {}

  getColorCode(key: Key) {
    const hash = this.signature
      .hash256(new Buffer(key.id), key.signature_type)
      .toString("hex");
    return `#${hash.substr(0, 6)}`;
  }
}
