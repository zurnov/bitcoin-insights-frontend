import { Component, OnInit } from '@angular/core';
import { InsightsService } from '../insights.service';
import { IAddressHistory } from 'src/app/shared/interfaces/addressHistory';
import { IAddressBalance } from 'src/app/shared/interfaces/addressBalance';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  addressBalance: IAddressBalance | undefined;
  addressHistory: IAddressHistory | undefined;

  constructor(private insightsService: InsightsService) {}

  ngOnInit(): void {
    //!static addresses
    this.insightsService
      .getAddressBalance('bc1q8yj0herd4r4yxszw3nkfvt53433thk0f5qst4g')
      .subscribe({
        next: (data: IAddressBalance) => {
          this.addressBalance = data;
          // console.log('Address balance fetched:', this.addressBalance);
        },
        error: (err: Error) => {
          console.error('Error fetching address balance:', err);
        },
      });

    this.insightsService
      .getAddressHistory('34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo')
      .subscribe({
        next: (data: IAddressHistory) => {
          this.addressHistory = data;
          // console.log('Address history fetched:', this.addressHistory);
        },
        error: (err: Error) => {
          console.error('Error fetching address history:', err);
        },
      });
  }
}
