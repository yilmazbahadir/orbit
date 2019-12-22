export interface Key {
  id: string;
  public_key: string;
  signature_type: SignatureTypes;
  mnemonic: string;
  coin_type: CoinTypes;
  account: number;
  change: number;
  address_index: number;
  hashed_password?: string;
}

export enum SignatureTypes {
  SECP256K1_SHA256 = "secp256k1-sha256",
  ED25519 = "ed25519",
  CURVE25519_KECCAK512 = "curve25519-keccak512",
  CURVE25519_SHA3_512 = "curve25519-sha3-512"
}

export enum CoinTypes {
  BITCOIN = 0,
  TESTNET = 1,
  NEM = 43,
  ETHEREUM = 60,
  COSMOS = 118
}
