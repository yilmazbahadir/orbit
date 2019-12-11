import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  isBackUnavailable$: Observable<boolean>;
  constructor(private route: ActivatedRoute) {
    this.isBackUnavailable$ = this.route.data.pipe(
      map(data => data.isBackUnavailable as boolean)
    );
  }
}
