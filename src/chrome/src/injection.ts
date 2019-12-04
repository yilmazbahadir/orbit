const contentStream = new LocalMessageDuplexStream({
  name: "injection",
  target: "content"
});

let contentStreamQueue: {
  [id: string]: {
    resolve(data: any): void;
    reject(data: any): void;
  };
} = {};

contentStream.on("data", (data: any) => {
  const item = contentStreamQueue[data.id];
  if (item === undefined) {
    return;
  }
  if (!data.error) {
    item.resolve(data.value);
  } else {
    item.reject(data.error);
  }
  delete contentStreamQueue[data.id];
});

function getRandomId(): string {
  const min = 0;
  const max = 999999999;
  const random = Math.floor(Math.random() * (max - min)) + min;
  return random.toString() + Date.now().toString();
}

(window as any).cosmos = {
  getPubKey(): Promise<{ type: string; value: Buffer }> {
    const id = getRandomId();
    contentStream.write({
      id,
      type: "GET_PUBKEY"
    });
    return new Promise((resolve, reject) => {
      contentStreamQueue[id] = {
        resolve,
        reject
      };
    });
  },

  requestAnnounce(stdTxJSONString: string): Promise<any> {
    const id = getRandomId();
    contentStream.write({
      id,
      type: "POST_STDTX",
      value: stdTxJSONString
    });
    return new Promise((resolve, reject) => {
      contentStreamQueue[id] = {
        resolve,
        reject
      };
    });
  }
};
