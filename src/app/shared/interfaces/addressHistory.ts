import { ITransactionInfo } from './transactionInfo';

interface ITransaction {
  txHash: string;
  blockHeight: number;
  details: ITransactionInfo;
}

export interface IAddressHistory {
  transactions: ITransaction[];
  totalPages: number;
}
