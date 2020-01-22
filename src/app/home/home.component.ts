import { Component, OnInit } from "@angular/core";
import { Key } from "../core/types/key";
import { KeyService } from "../core/services/key.service";
import { from, Observable } from "rxjs";
import { SignatureAlgorithm } from "../core/types/signature-algorithm";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  keys$: Observable<Key[]>;

  constructor(private key: KeyService) {
    this.keys$ = from(this.key.all());
  }

  ngOnInit() {}

  getColorCode(key: Key) {
    const hash = SignatureAlgorithm.create(key.signature_type)
      .hash(new Buffer(key.id))
      .toString("hex");
    return `#${hash.substr(0, 6)}`;
  }
}
