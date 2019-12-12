import { Injectable } from "@angular/core";
import * as crypto from "crypto";
import { HashTypes } from "../../../types/key";
import { SHA3, Keccak } from "sha3";

@Injectable({
  providedIn: "root"
})
export class HashService {
  constructor() {}

  sha256(data: Buffer) {
    return crypto
      .createHash("sha256")
      .update(data)
      .digest();
  }

  sha3_256(data: Buffer) {
    return new SHA3(256).update(data).digest();
  }

  keccak256(data: Buffer) {
    return new Keccak(256).update(data).digest();
  }

  hash(data: Buffer, hashType: HashTypes) {
    switch (hashType) {
      case HashTypes.SHA256:
        return this.sha256(data);
      case HashTypes.SHA3_256:
        return this.sha3_256(data);
      case HashTypes.KECCAK256:
        return this.keccak256(data);
      default:
        return new Buffer("");
    }
  }
}
