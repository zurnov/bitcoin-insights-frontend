import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IBlockchainInfo } from '../shared/interfaces/blockchainInfo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InsightsService {
  private baseUrl = 'https://www.zurnov.com/api/v1/btc-insights';

  constructor(private http: HttpClient) {}

  getBlockchainInfo(): Observable<IBlockchainInfo> {
    return this.http.get<IBlockchainInfo>(`${this.baseUrl}/getblockchaininfo`);
  }
}
