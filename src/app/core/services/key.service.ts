import { Injectable } from "@angular/core";
import { Key, CoinTypes } from "../../../types/key";
import * as bip32 from "bip32";
import * as bip39 from "bip39";
import { SignatureService } from "./signature.service";

@Injectable({
  providedIn: "root"
})
export class KeyService {
  constructor(private signature: SignatureService) {}

  onUpgradeNeeded(event: any) {
    const db: IDBDatabase = event.target.result;
    db.createObjectStore("key", { keyPath: "id" });
  }

  async generatePrivateKey(key: Key, password?: string): Promise<Buffer> {
    const seed = await bip39.mnemonicToSeed(key.mnemonic, password);
    const node = bip32.fromSeed(seed);
    const bip44 = `m/44'/${key.coin_type}'/${key.account}'/${key.change}/${key.address_index}`;
    const child = node.derivePath(bip44);

    return child.privateKey!;
  }

  async create(key: Omit<Key, "public_key">, password?: string) {
    const _key: Key = {
      ...key,
      public_key: ""
    };
    if (password) {
      key.hashed_password = this.signature
        .hash256(new Buffer(password), key.signature_type)
        .toString("hex");
    }

    const privateKey = await this.generatePrivateKey(_key, password);
    _key.public_key = this.signature
      .publicKey(key.signature_type, privateKey)
      .toString("hex");

    await this.set(_key);

    return _key;
  }

  get(id: string): Promise<Key | undefined> {
    return new Promise((resolve, reject) => {
      const openReq = indexedDB.open("orbit");
      openReq.onupgradeneeded = this.onUpgradeNeeded;
      openReq.onsuccess = _ => {
        const db = openReq.result;
        const store = db.transaction("key", "readonly").objectStore("key");
        const getReq = store.get(id);
        getReq.onsuccess = event => {
          const key = (event.target as any).result;
          resolve(key);
        };
        getReq.onerror = event => {
          reject((event.target as any).result);
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
        getReq.onerror = event => {
          reject((event.target as any).result);
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
        putReq.onerror = event => {
          reject((event.target as any).result);
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
        deleteReq.onerror = event => {
          reject((event.target as any).result);
        };
      };
    });
  }

  getCoinTypeString(coinType: CoinTypes) {
    switch (coinType) {
      case CoinTypes.BITCOIN:
        return "0 Bitcoin";
      case CoinTypes.TESTNET:
        return "1 Testnet for All";
      case CoinTypes.NEM:
        return "43 NEM";
      case CoinTypes.ETHEREUM:
        return "60 Ethereum";
      case CoinTypes.COSMOS:
        return "118 Cosmos";
    }
  }

  getChangeString(change: number) {
    switch (change) {
      case 0:
        return "0 External Chain";
      case 1:
        return "1 Internal Chain";
      default:
        return "";
    }
  }
}
