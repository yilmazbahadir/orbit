interface Request {
  host: string;
  pubKey: Buffer;
  stdTxJSONString: string;
  sendResponse(response: any): void;
}

let requestsMap: { [tabID: number]: Request } = {};

function exists(): boolean {
  return true;
}

function getPubKey(): { type: string; value: Buffer } {
  return {
    type: "",
    value: new Buffer("")
  };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case "INIT":
      sendResponse({
        id: request.id,
        value: exists()
      });
      break;
    case "GET_PUBKEY":
      sendResponse({
        id: request.id,
        value: getPubKey()
      });
      break;
    case "POST_STDTX":
      chrome.tabs.create(
        {
          url: "index.html#/announce",
          active: true
        },
        tab => {
          requestsMap[tab!.id!] = request.value;
        }
      );
      break;
  }
  return true;
});
