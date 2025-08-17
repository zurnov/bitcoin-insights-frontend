import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IBlockchainInfo } from '../shared/interfaces/blockchainInfo';
import { Observable, firstValueFrom, shareReplay } from 'rxjs';
import { IAddressBalance } from '../shared/interfaces/addressBalance';
import { IAddressHistory } from '../shared/interfaces/addressHistory';
import { IBlockInfo } from '../shared/interfaces/blockInfo';
import { ITransactionInfo } from '../shared/interfaces/transactionInfo';

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  // private baseUrl: string = 'http://localhost:8000/api/v1/btc-insights';
  private baseUrl: string = 'https://api.explore21.com/api/v1/btc-insights';
  private blockchainInfoCache$?: Observable<IBlockchainInfo>;
  private lastBlockchainInfoFetch: number = 0;

  constructor(private http: HttpClient) {}

  getBlockchainInfo(): Observable<IBlockchainInfo> {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (this.blockchainInfoCache$ && now - this.lastBlockchainInfoFetch < tenMinutes) {
      return this.blockchainInfoCache$;
    }

    this.lastBlockchainInfoFetch = now;
    this.blockchainInfoCache$ = this.http
      .get<IBlockchainInfo>(`${this.baseUrl}/getblockchaininfo`)
      .pipe(shareReplay(1));

    return this.blockchainInfoCache$;
  }

  getAddressBalance(address: string): Observable<IAddressBalance> {
    return this.http.get<IAddressBalance>(
      `${this.baseUrl}/getaddressbalance/${address}`
    );
  }

  getAddressHistory(
    address: string,
    pageNumber: number = 1,
    pageSize: number = 12
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
    pageSize: number = 5
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
    pageSize: number = 5
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
