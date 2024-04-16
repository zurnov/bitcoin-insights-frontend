import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBlockchainInfo } from '../shared/interfaces/blockchainInfo';
import { Observable } from 'rxjs';
import { IAddressBalance } from '../shared/interfaces/addressBalance';
import { IAddressHistory } from '../shared/interfaces/addressHistory';
import { IBlockInfo } from '../shared/interfaces/blockInfo';

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

  getAddressHistory(address: string): Observable<IAddressHistory> {
    return this.http.get<IAddressHistory>(
      `${this.baseUrl}/getaddresshistory/${address}`
    );
  }

  getBlockInfoByHeight(height: number): Observable<IBlockInfo> {
    return this.http.get<IBlockInfo>(
      `${this.baseUrl}/getblockinfobyheight/${height}`
    );
  }
}
