import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, combineLatest, interval } from 'rxjs';
import { InsightsService } from 'src/app/insights/insights.service';
import { IBlockInfo } from 'src/app/shared/interfaces/blockInfo';
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
  latestBlocks: IBlockInfo[] = [];

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

        const latestBlockHeight = data.blocks;
        const prevToLastBlockHeight = latestBlockHeight - 1; //! starting from prev to last as api cannot fetch newest block info

        //*latest blocks
        const blockHeights = Array.from(
          { length: 10 },
          (_, index) => prevToLastBlockHeight - index
        );
        const blockInfoRequests: Observable<IBlockInfo>[] = blockHeights.map(
          (height) => {
            return this.insightsService.getBlockInfoByHeight(height);
          }
        );

        combineLatest(blockInfoRequests).subscribe({
          next: (blockInfos: IBlockInfo[]) => {
            this.latestBlocks = blockInfos; //! updated with refresh sub
            // console.log('Latest blocks:', this.latestBlocks);
          },
          error: (err: Error) => {
            console.error('Error fetching latest blocks details:', err);
          },
        });

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

  trimTrailingZeros(value: string): string {
    return value.replace(/\.?0+$/, '');
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }
}
