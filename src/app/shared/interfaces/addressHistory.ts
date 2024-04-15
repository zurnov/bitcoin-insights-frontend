interface ITransaction {
  txHash: string;
  blockHeight: number;
}

export interface IAddressHistory {
  transactions: ITransaction[];
}
