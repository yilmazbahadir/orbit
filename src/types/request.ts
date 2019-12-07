export interface Request {
  keyID: string;
  dataHexString: string;
  callback(response: boolean, password?: string): void;
}
