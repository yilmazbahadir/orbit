interface Key {
  id: string;
  public_key: string;
  hash_type: HashTypes;
  signature_type: SignatureTypes;
  mnemonic: string;
  coin_type: number;
  account: number;
  change: number;
  address_index: number;
  hashed_password?: string;
}

enum HashTypes {
  SHA256 = "sha256"
}

enum SignatureTypes {
  SECP256K1 = "secp256k1"
}

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

  requestSignature(keyName: string, dataHexString: string): Promise<any> {
    const id = getRandomId();
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
