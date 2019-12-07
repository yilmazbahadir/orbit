import { Injectable } from "@angular/core";
import * as crypto from "crypto";
import { HashTypes } from "../../../types/key";

@Injectable({
  providedIn: "root"
})
export class HashService {
  constructor() {}

  sha256(data: Buffer) {
    return crypto
      .createHash("sha256")
      .update(data)
      .digest("hex");
  }

  hash(dataHexString: string, hashType: HashTypes) {
    const data = Buffer.from(dataHexString, "hex");
    let hash;
    switch (hashType) {
      case HashTypes.SHA256:
        hash = this.sha256(data);
        break;
      default:
        hash = "";
        break;
    }
    return hash;
  }
}
