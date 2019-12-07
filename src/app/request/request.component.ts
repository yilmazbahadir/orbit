import { Component, OnInit } from "@angular/core";
import { Request } from "../../types/request";
import { KeyService } from "../core/services/key.service";
import { HashTypes } from "../../types/key";
import { HashService } from '../core/services/hash.service';

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"]
})
export class RequestComponent implements OnInit {
  forms: {
    password: string;
  };
  request: Request;

  keyName: string;
  keyHashType: HashTypes;
  keyHashedPassword?: string;

  constructor(private key: KeyService, private hash: HashService) {
    this.forms = {
      password: ""
    };
    this.request = {
      keyID: "",
      dataHexString: "",
      callback: (reponse: boolean) => {}
    };
    this.keyName = "";
    this.keyHashType = HashTypes.SHA256;
  }

  ngOnInit() {
    chrome.tabs.getCurrent(tab => {
      const background: any = chrome.extension.getBackgroundPage();
      this.request = background.window.orbit.requestsMap[tab!.id!];
      this.key.get(this.request.keyID).then(key => {
        this.keyName = key.name;
        this.keyHashType = key.hash_type
        this.keyHashedPassword = key.hashed_password;
      });
    });
  }

  reject() {
    this.request.callback(false);
  }

  confirm() {
    if(this.keyHashedPassword) {
      const passwordHexString = new Buffer(this.forms.password).toString("hex")
      const hash = this.hash.hash(passwordHexString, this.keyHashType)
      if(hash !== this.keyHashedPassword) {
        return;
      }
    }
    
    this.request.callback(true);
  }
}
