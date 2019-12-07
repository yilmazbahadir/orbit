import { Component, OnInit } from "@angular/core";
import { Key } from "../../types/key";
import { KeyService } from "../core/services/key.service";
import { from, Observable } from "rxjs";

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
    return `#${key.id.substr(0, 6)}`;
  }
}
