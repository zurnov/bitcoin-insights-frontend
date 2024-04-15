import { Component, OnInit } from '@angular/core';
import { InsightsService } from '../insights.service';
import { IAddressHistory } from 'src/app/shared/interfaces/addressHistory';
import { IAddressBalance } from 'src/app/shared/interfaces/addressBalance';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit {
  addressBalance: IAddressBalance | undefined;
  addressHistory: IAddressHistory | undefined;
  walletAddress: string | null = null;

  constructor(
    private insightsService: InsightsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.walletAddress = this.route.snapshot.paramMap.get('address');
    if (!this.walletAddress) {
      return;
    }

    this.insightsService.getAddressBalance(this.walletAddress).subscribe({
      next: (data: IAddressBalance) => {
        this.addressBalance = data;
        // console.log('Address balance fetched:', this.addressBalance);
      },
      error: (err: Error) => {
        console.error('Error fetching address balance:', err);
        alert('Error fetching address balance');
        this.router.navigate(['/']);
      },
    });

    this.insightsService.getAddressHistory(this.walletAddress).subscribe({
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
