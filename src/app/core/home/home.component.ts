import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { InsightsService } from 'src/app/insights/insights.service';
import { IBlockchainInfo } from 'src/app/shared/interfaces/blockchainInfo';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tenMinsInMilliseconds = 10 * 60 * 1000;
  private refreshSubscription!: Subscription;

  blockchainInfo: IBlockchainInfo | undefined;

  constructor(
    private insightsService: InsightsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let fetchCounter = 1;
    this.fetchBlockchainInfo(fetchCounter);

    this.refreshSubscription = interval(this.tenMinsInMilliseconds).subscribe(
      () => {
        fetchCounter++;
        this.fetchBlockchainInfo(fetchCounter);
      }
    );
  }

  fetchBlockchainInfo(fetchCounter: number) {
    this.insightsService.getBlockchainInfo().subscribe({
      next: (data: IBlockchainInfo) => {
        this.blockchainInfo = data;

        // console.log(
        //   `Blockchain info fetched for the ${fetchCounter} time:`,
        //   this.blockchainInfo
        // );
      },
      error: (err: Error) => {
        console.error('Error fetching blockchain info:', err);
      },
    });
  }

  onSearch(address: string) {
    if (address.trim() !== '') {
      return this.router.navigate(['/insights', address]);
    }
    return alert('Enter valid bitcoin address!');
  }

  formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}m ${seconds}s`;
  }

  getMonthName(month: number): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return months[month];
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }
}
