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

  onSearch(query: string) {
    let queryTrimmed = query.trim();
    if (queryTrimmed !== '') {
      if (this.isWalletAddress(queryTrimmed)) {
        // console.log('received wallet address');
        return this.router.navigate(['/insights/address', queryTrimmed]);
      } else if (this.isBlockOrTransactionHash(queryTrimmed)) {
        if (/^0{15,}/.test(queryTrimmed)) {
          //! checking for 15 consecutive leading zeroes; current are 18;
          // console.log('block hash received');
          return this.router.navigate(['/insights/block', queryTrimmed]);
        } else {
          // console.log('TX hash received');
          return this.router.navigate(['/insights/transaction', queryTrimmed]);
        }
      } else if (this.isBlockHeight(queryTrimmed)) {
        // console.log('received block height');

        return this.router.navigate(['/insights/block', queryTrimmed]);
      }
    }
    return alert('Enter valid query - address, transaction, or block...');
  }

  isBlockHeight(query: string): boolean {
    const regex = /^[0-9]+$/;
    return regex.test(query);
  }

  isBlockOrTransactionHash(query: string): boolean {
    const regex = /^[0-9a-fA-F]{64}$/;
    return regex.test(query);
  }

  isWalletAddress(query: string): boolean {
    const regex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    return regex.test(query);
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }
}
