import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-background",
  templateUrl: "./background.component.html",
  styleUrls: ["./background.component.css"]
})
export class BackgroundComponent implements OnInit {
  constructor() {
    (window as any).orbit = {
      requestsMap: {} as { [id: string]: Request }
    };
  }

  ngOnInit() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case "GET_PUBKEY":
          sendResponse({
            id: request.id,
            value: this.getPubKey()
          });
          break;
        case "POST_STDTX":
          chrome.tabs.create(
            {
              url: "index.html#/request",
              active: true
            },
            tab => {
              (window as any).orbit.requestsMap[tab!.id!] = {
                ...request.value,
                callback: (response: boolean) => {
                  if (!response) {
                    sendResponse({
                      id: request.id,
                      error: new Error("Denied")
                    });
                    return;
                  }
                  this.sign(request.value.stdTxJSONString).then(value => {
                    sendResponse({
                      id: request.id,
                      value: value
                    });
                  });
                  chrome.tabs.remove(tab!.id!);
                }
              };
            }
          );
          break;
      }
      return true;
    });
  }

  getPubKey(): { type: string; value: string } {
    return {
      type: "",
      value: ""
    };
  }

  async sign(stdTxJSONString: string): Promise<string> {
    return stdTxJSONString;
  }
}

interface Request {
  pubKey: {
    type: string;
    value: string;
  };
  stdTxJSONString: string;
  callback(response: boolean): void;
}
