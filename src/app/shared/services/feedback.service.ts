import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FeedbackPayload {
  email?: string;
  message: string;
  pageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  private readonly endpoint = '/api/v1/btc-insights/feedback';

  constructor(private http: HttpClient) {}

  submit(payload: FeedbackPayload): Observable<void> {
    return this.http.post<void>(this.endpoint, payload);
  }
}
