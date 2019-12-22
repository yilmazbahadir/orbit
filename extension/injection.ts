import { Key } from "../src/app/core/types/key";

const contentScriptQueue = {} as {
  [id: string]: {
    resolve(data: any): void;
    reject(data: any): void;
  };
};

function contentScriptCallback(response: any) {
  const item = contentScriptQueue[response.id];
  if (item === undefined) {
    return;
  }
  if (!response.error) {
    item.resolve(response.value);
  } else {
    item.reject(response.error);
  }
  delete contentScriptQueue[response.id];
}

function getRandomId() {
  const min = 0;
  const max = 999999999;
  const random = Math.floor(Math.random() * (max - min)) + min;
  return random.toString() + Date.now().toString();
}

(window as any).orbit = {
  getKeys(): Promise<Key[]> {
    const id = getRandomId();
    window.postMessage(
      {
        id,
        type: "GET_KEYS"
      },
      "*"
    );
    return new Promise((resolve, reject) => {
      contentScriptQueue[id] = {
        resolve,
        reject
      };
    });
  },

  requestSignature(keyID: string, dataHexString: string): Promise<string> {
    const id = getRandomId();
    window.postMessage(
      {
        id,
        type: "REQUEST_SIGNATURE",
        value: {
          keyID,
          dataHexString
        }
      },
      "*"
    );
    return new Promise((resolve, reject) => {
      contentScriptQueue[id] = {
        resolve,
        reject
      };
    });
  }
};

window.addEventListener("message", event => {
  switch (event.data.type) {
    case "CALLBACK":
      contentScriptCallback(event.data.value);
      break;
  }
});
