import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { KeyService } from "../../core/services/key.service";
import { Key } from "../../../types/key";
import { Observable, from } from "rxjs";
import { map, mergeMap, filter, toArray, first } from "rxjs/operators";

@Component({
  selector: "app-key",
  templateUrl: "./key.component.html",
  styleUrls: ["./key.component.css"]
})
export class KeyComponent implements OnInit {
  key$: Observable<Key>;

  constructor(private route: ActivatedRoute, private key: KeyService) {
    this.key$ = this.route.params.pipe(
      map(params => params["id"]),
      mergeMap(id =>
        from(this.key.all()).pipe(
          mergeMap(keys => from(keys).pipe(filter(key => key.id === id))),
          first()
        )
      )
    );
  }

  ngOnInit() {}
}
