export interface ITransactionInfo {
  txId: string;
  hash: string;
  size: number;
  weight: number;
  version: number;
  lockTime: number;
  vin: {
    txId: string;
    coinbase: string;
    vout: number;
    scriptSig: {
      asm: string;
      hex: string;
    } | null;
    sequence: number;
    txInWitness: string[];
  }[];
  vout: {
    value: number;
    n: number;
    scriptPubKey: {
      asm: string;
      hex: string;
      type: string;
      address: string;
    } | null;
  }[];
  hex: string;
  blockHash: string;
  confirmations: number;
  blockTime: number;
  time: number;
  vbytes: number;
}
