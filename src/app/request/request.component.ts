import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"]
})
export class RequestComponent implements OnInit {
  request: {
    pubKey: {
      type: string;
      value: string;
    };
    stdTxJSONString: string;
    callback(response: boolean): void;
  };

  forms: {
    memo: string;
  };

  @ViewChild("memo", { static: true })
  memo?: ElementRef;

  constructor() {
    this.request = {
      pubKey: {
        type: "",
        value: ""
      },
      stdTxJSONString: "",
      callback: (reponse: boolean) => {}
    };
    this.forms = {
      memo: ""
    };
  }

  ngOnInit() {
    chrome.tabs.getCurrent(tab => {
      const background: any = chrome.extension.getBackgroundPage();
      this.request = background.window.orbit.requestsMap[tab!.id!];
      this.memo!.nativeElement.focus();
    });
  }

  reject() {
    this.request.callback(false);
  }

  confirm() {
    this.request.callback(true);
  }
}
