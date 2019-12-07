import { Key } from "../../types/key";

(window as any).orbit = {
  contentScriptQueue: {} as {
    [id: string]: {
      resolve(data: any): void;
      reject(data: any): void;
    };
  },

  contentScriptCallback: (response: any) => {
    const item = (window as any).orbit.contentScriptQueue[response.id];
    if (item === undefined) {
      return;
    }
    if (!response.error) {
      item.resolve(response.value);
    } else {
      item.reject(response.error);
    }
    delete (window as any).orbit.contentScriptQueue[response.id];
  },

  getRandomId: () => {
    const min = 0;
    const max = 999999999;
    const random = Math.floor(Math.random() * (max - min)) + min;
    return random.toString() + Date.now().toString();
  }
};

(window as any).cosmos = {
  getKeys(): Promise<Key[]> {
    const id = (window as any).orbit.getRandomId();
    window.postMessage(
      {
        id,
        type: "GET_KEYS"
      },
      "*"
    );
    return new Promise((resolve, reject) => {
      (window as any).orbit.contentScriptQueue[id] = {
        resolve,
        reject
      };
    });
  },

  requestSignature(keyName: string, dataHexString: string): Promise<any> {
    const id = (window as any).orbit.getRandomId();
    window.postMessage(
      {
        id,
        type: "REQUEST_SIGNATURE",
        value: {
          keyName,
          dataHexString
        }
      },
      "*"
    );
    return new Promise((resolve, reject) => {
      (window as any).orbit.contentScriptQueue[id] = {
        resolve,
        reject
      };
    });
  }
};

window.addEventListener("message", event => {
  switch (event.data.type) {
    case "CALLBACK":
      (window as any).orbit.contentScriptCallback(event.data.value);
      break;
  }
});
