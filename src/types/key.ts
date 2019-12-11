export interface Key {
  id: string;
  public_key: string;
  hash_type: HashTypes;
  signature_type: SignatureTypes;
  mnemonic: string;
  coin_type: CoinTypes;
  account: number;
  change: number;
  address_index: number;
  hashed_password?: string;
}

export enum HashTypes {
  SHA256 = "sha256"
}

export enum SignatureTypes {
  SECP256K1 = "secp256k1"
}

export enum CoinTypes {
  BITCOIN = 0,
  TESTNET = 1,
  COSMOS = 118
}
