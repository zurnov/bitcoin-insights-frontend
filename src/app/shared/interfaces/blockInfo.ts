export interface IBlockInfo {
  strippedSize: number;
  size: number;
  weight: number;
  confirmations: number;
  blockHeight: number;
  version: number;
  time: Date;
  medianTime: Date;
  nonce: number;
  difficulty: number;
  hash: string;
  versionHex: string;
  merkleRoot: string;
  bits: string;
  chainWork: string;
  previousBlockHash: string;
  nextBlockHash: string;
  transactions: string[];
  ntx: number;
}
