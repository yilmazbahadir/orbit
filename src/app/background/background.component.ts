import { Component, OnInit } from "@angular/core";
import { KeyService } from "../core/services/key.service";
import { SignatureService } from "../core/services/signature.service";
import { Request } from "../core/types/request";

@Component({
  selector: "app-background",
  templateUrl: "./background.component.html",
  styleUrls: ["./background.component.css"]
})
export class BackgroundComponent implements OnInit {
  constructor(
    private key: KeyService,
    private signature: SignatureService
  ) {
    (window as any).orbit = {
      requestsMap: {} as { [id: string]: Request }
    };
  }

  ngOnInit() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.type) {
        case "GET_KEYS":
          this.getKeys(request.id, sendResponse);
          break;
        case "REQUEST_SIGNATURE":
          this.requestSignature(
            request.id,
            request.value.keyID,
            request.value.dataHexString,
            sendResponse
          );
          break;
      }
      return true;
    });
  }

  getKeys(requestID: string, sendResponse: (response?: any) => void) {
    this.key.all().then(keys => {
      sendResponse({
        id: requestID,
        value: keys
      });
    });
  }

  requestSignature(
    requestID: string,
    keyID: string,
    dataHexString: string,
    sendResponse: (response?: any) => void
  ) {
    chrome.tabs.create(
      {
        url: "index.html#/request",
        active: true
      },
      tab => {
        (window as any).orbit.requestsMap[tab!.id!] = {
          keyID,
          dataHexString,
          callback: async (response: boolean, password?: string) => {
            try {
              if (!response) {
                throw new Error();
              }
              const signature = await this.sign(keyID, dataHexString, password);
              sendResponse({
                id: requestID,
                value: signature.toString("hex")
              });
            } catch {
              sendResponse({
                id: requestID,
                error: new Error("Denied")
              });
            } finally {
              chrome.tabs.remove(tab!.id!);
            }
          }
        } as Request;
      }
    );
  }

  async sign(keyID: string, dataHexString: string, password?: string) {
    const key = await this.key.get(keyID);
    if (key === undefined) {
      throw Error();
    }
    const privateKey = await this.key.generatePrivateKey(key, password);
    const data = new Buffer(dataHexString, "hex")
    return this.signature.sign(data, key.signature_type, privateKey);
  }
}
