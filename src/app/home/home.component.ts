import { Component, OnInit } from "@angular/core";
import { Key } from "../../types/key";
import { KeyService } from "../core/services/key.service";
import { from, Observable } from "rxjs";
import { HashService } from '../core/services/hash.service';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  keys$: Observable<Key[]>;

  constructor(private key: KeyService, private hash: HashService) {
    this.keys$ = from(this.key.all());
  }

  ngOnInit() {}

  getColorCode(key: Key) {
    const hash = this.hash.hash(new Buffer(key.id), key.hash_type).toString("hex")
    return `#${hash.substr(0, 6)}`;
  }
}
