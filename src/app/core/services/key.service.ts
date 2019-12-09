import { Injectable } from "@angular/core";
import { Key, HashTypes, SignatureTypes } from "../../../types/key";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import { HashService } from "./hash.service";
import { SignatureService } from "./signature.service";

@Injectable({
  providedIn: "root"
})
export class KeyService {
  constructor(private hash: HashService, private signature: SignatureService) {}

  onUpgradeNeeded(event: any) {
    const db: IDBDatabase = event.target.result;
    db.createObjectStore("key", { keyPath: "id" });
  }

  async create(
    id: string,
    mnemonic: string,
    coinType: number,
    account: number,
    change: number,
    addressIndex: number,
    hashType: HashTypes,
    signatureType: SignatureTypes,
    password?: string
  ) {
    const key: Key = {
      id: id,
      mnemonic: mnemonic,
      public_key: "",
      coin_type: coinType,
      account: account,
      change: change,
      address_index: addressIndex,
      hash_type: hashType,
      signature_type: signatureType
    };
    if (password) {
      const passwordHexString = new Buffer(password).toString("hex");
      key.hashed_password = this.hash.hash(passwordHexString, key.hash_type);
    }

    const privateKey = await this.generatePrivateKey(key, password);
    key.public_key = this.signature
      .publicKey(signatureType, privateKey)
      .toString("hex");
    await this.set(key);

    return key;
  }

  get(id: string): Promise<Key> {
    return new Promise((resolve, reject) => {
      if(!id) {
        reject(new Error())
        return
      }
      const openReq = indexedDB.open("orbit");
      openReq.onupgradeneeded = this.onUpgradeNeeded;
      openReq.onsuccess = _ => {
        const db = openReq.result;
        const store = db.transaction("key", "readonly").objectStore("key");
        const getReq = store.get(id);
        getReq.onsuccess = event => {
          const key = (event.target as any).result
          if(key === undefined) {
            reject(new Error())
            return
          }
          resolve(key);
        };
        getReq.onerror = _ => {
          reject(new Error());
        };
      };
    });
  }

  all(): Promise<Key[]> {
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open("orbit");
      openReq.onupgradeneeded = this.onUpgradeNeeded;
      openReq.onsuccess = _ => {
        const db = openReq.result;
        const store = db.transaction("key", "readonly").objectStore("key");
        const getReq = store.getAll();
        getReq.onsuccess = event => {
          resolve((event.target as any).result);
        };
        getReq.onerror = _ => {
          reject(new Error());
        };
      };
    });
  }

  set(key: Key): Promise<string> {
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open("orbit");
      openReq.onupgradeneeded = this.onUpgradeNeeded;
      openReq.onsuccess = _ => {
        const db = openReq.result;
        const store = db.transaction("key", "readwrite").objectStore("key");
        const putReq = store.put(key);
        putReq.onsuccess = _ => {
          resolve(key.id);
        };
        putReq.onerror = _ => {
          reject(new Error());
        };
      };
    });
  }

  delete(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open("orbit");
      openReq.onupgradeneeded = this.onUpgradeNeeded;
      openReq.onsuccess = _ => {
        const db = openReq.result;
        const store = db.transaction("key", "readwrite").objectStore("key");
        const deleteReq = store.delete(id);
        deleteReq.onsuccess = _ => {
          resolve();
        };
        deleteReq.onerror = _ => {
          reject(new Error());
        };
      };
    });
  }

  async generatePrivateKey(key: Key, password?: string): Promise<Buffer> {
    const seed = await bip39.mnemonicToSeed(key.mnemonic, password);
    const node = bip32.fromSeed(seed);
    const bip44 = `m/44'/${key.coin_type}'/${key.account}'/${key.change}/${key.address_index}`;
    const child = node.derivePath(bip44);

    return child.privateKey!;
  }
}
