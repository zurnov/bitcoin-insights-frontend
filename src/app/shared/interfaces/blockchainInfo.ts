export interface IBlockchainInfo {
  blocks: number;
  difficulty: number;
  networkHashPerSecond: number;
  pooledTx: number;
  chain: string;
}
