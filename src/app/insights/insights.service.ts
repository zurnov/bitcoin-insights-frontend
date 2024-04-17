import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IBlockchainInfo } from '../shared/interfaces/blockchainInfo';
import { Observable } from 'rxjs';
import { IAddressBalance } from '../shared/interfaces/addressBalance';
import { IAddressHistory } from '../shared/interfaces/addressHistory';
import { IBlockInfo } from '../shared/interfaces/blockInfo';
import { ITransactionInfo } from '../shared/interfaces/transactionInfo';

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  private baseUrl = 'https://www.zurnov.com/api/v1/btc-insights';

  constructor(private http: HttpClient) {}

  getBlockchainInfo(): Observable<IBlockchainInfo> {
    return this.http.get<IBlockchainInfo>(`${this.baseUrl}/getblockchaininfo`);
  }

  getAddressBalance(address: string): Observable<IAddressBalance> {
    return this.http.get<IAddressBalance>(
      `${this.baseUrl}/getaddressbalance/${address}`
    );
  }

  getAddressHistory(
    address: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<IAddressHistory> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<IAddressHistory>(
      `${this.baseUrl}/getaddresshistory/${address}`,
      { params }
    );
  }

  getBlockInfoByHeight(
    height: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<IBlockInfo> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<IBlockInfo>(
      `${this.baseUrl}/getblockinfobyheight/${height}`,
      { params }
    );
  }

  getBlockInfoByHash(
    hash: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<IBlockInfo> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<IBlockInfo>(
      `${this.baseUrl}/getblockinfobyhash/${hash}`,
      { params }
    );
  }

  getTransactionInfo(txHash: string): Observable<ITransactionInfo> {
    return this.http.get<ITransactionInfo>(
      `${this.baseUrl}/gettransactioninfo/${txHash}`
    );
  }
}
