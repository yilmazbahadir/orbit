import { Component, OnInit, KeyValueDiffers, KeyValueDiffer } from '@angular/core';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
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
  differ: KeyValueDiffer<any, any>;

  constructor(private kvd: KeyValueDiffers) {
    this.request = {
      pubKey: {
        type: "",
        value: ""
      },
      stdTxJSONString: "",
      callback: (reponse: boolean) => {}
    };

    this.differ = this.kvd.find(this.request).create()
  }

  ngOnInit() {
    chrome.tabs.getCurrent(tab => {
      const background: any = chrome.extension.getBackgroundPage();
      this.request = background.window.orbit.requestsMap[tab!.id!];
      this.differ.diff(this.request);
    });
  }

  reject() {
    this.request.callback(false);
  }

  confirm() {
    this.request.callback(true);
  }
}
