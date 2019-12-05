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
  getPubKey(): Promise<{ type: string; value: Buffer }> {
    const id = (window as any).orbit.getRandomId();
    window.postMessage(
      {
        id,
        type: "GET_PUBKEY"
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

  requestSignature(
    pubKey: { type: string; value: string },
    stdTxJSONString: string
  ): Promise<any> {
    const id = (window as any).orbit.getRandomId();
    window.postMessage(
      {
        id,
        type: "POST_STDTX",
        value: {
          pubKey,
          stdTxJSONString
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
