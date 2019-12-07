import { Injectable } from "@angular/core";
import { Key } from "../../../types/key";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import { HashService } from "./hash.service";

@Injectable({
  providedIn: "root"
})
export class KeyService {
  constructor(private hash: HashService) {
    const openReq = indexedDB.open("orbit");
    openReq.onupgradeneeded = _ => {
      const db = openReq.result;
      switch (db.version) {
        case 0:
          db.createObjectStore("key", { keyPath: "id" });
          break;
        case 1:
          break;
      }
    };
  }

  get(id: string): Promise<Key> {
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open("orbit");
      openReq.onsuccess = _ => {
        const db = openReq.result;
        const store = db.transaction("key", "readonly").objectStore("key");
        const getReq = store.get(id);
        getReq.onsuccess = event => {
          resolve((event.target as any).result);
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
      const hash = this.hash.sha256(new Buffer(key.id));
      key.id = hash;

      const openReq = indexedDB.open("orbit");
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
