import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { KeyService } from "../../core/services/key.service";
import { Key, CoinTypes } from "../../core/types/key";
import { Observable, from } from "rxjs";
import { map, mergeMap, filter, toArray, first } from "rxjs/operators";

@Component({
  selector: "app-key",
  templateUrl: "./key.component.html",
  styleUrls: ["./key.component.css"]
})
export class KeyComponent implements OnInit {
  key$: Observable<Key | undefined>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private key: KeyService
  ) {
    this.key$ = this.route.params.pipe(
      map(params => params["id"]),
      mergeMap(id =>
        from(this.key.all()).pipe(map(keys => keys.find(key => key.id === id)))
      )
    );
  }

  ngOnInit() {}

  copy(text: string) {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed';
    textarea.style.left = '0';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  async onClickDelete(id: string) {
    await this.key.delete(id)
    await this.router.navigate([""]);
  }

  getCoinTypeString(coinType: CoinTypes) {
    return this.key.getCoinTypeString(coinType);
  }

  getChangeString(change: number) {
    return this.key.getChangeString(change);
  }
}
