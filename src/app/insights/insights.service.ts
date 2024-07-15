import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IBlockchainInfo } from '../shared/interfaces/blockchainInfo';
import { Observable, firstValueFrom } from 'rxjs';
import { IAddressBalance } from '../shared/interfaces/addressBalance';
import { IAddressHistory } from '../shared/interfaces/addressHistory';
import { IBlockInfo } from '../shared/interfaces/blockInfo';
import { ITransactionInfo } from '../shared/interfaces/transactionInfo';

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  // private baseUrl: string = 'http://46.55.172.171:8000/api/v1/btc-insights';
  private baseUrl: string = 'https://api.zurnov.com/api/v1/btc-insights';
  private apiKey = 'EReo809/ulDgDLKm2A1VyQ==36ZVAXwepWGipXi1';

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

  async getBtcCurrentPrice(): Promise<number> {
    try {
      const symbol = 'BTCUSDT';
      const headers = new HttpHeaders().set('X-Api-Key', this.apiKey);
      const response: any = await firstValueFrom(
        this.http.get(
          `https://api.api-ninjas.com/v1/cryptoprice?symbol=${symbol}`,
          { headers }
        )
      );
      return response;
    } catch (err) {
      console.error('error fetching current BTC price:', err);
      throw err;
    }
  }
}
