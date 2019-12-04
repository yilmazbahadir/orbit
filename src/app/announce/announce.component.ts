import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-announce",
  templateUrl: "./announce.component.html",
  styleUrls: ["./announce.component.css"]
})
export class AnnounceComponent implements OnInit {
  request: {
    host: string;
    pubKey: Buffer;
    stdTxJSONString: string;
  };

  constructor() {
    this.request = {
      host: "",
      pubKey: new Buffer(""),
      stdTxJSONString: ""
    };
  }

  ngOnInit() {
    chrome.tabs.getCurrent(tab => {
      const background: any = chrome.extension.getBackgroundPage();
      this.request = background.requestsMap[tab!.id!];
    });
  }
}
