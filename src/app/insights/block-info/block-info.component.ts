import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { InsightsService } from '../insights.service';
import { IBlockInfo } from 'src/app/shared/interfaces/blockInfo';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, forkJoin, takeUntil } from 'rxjs';
import { ITransactionInfo } from 'src/app/shared/interfaces/transactionInfo';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { IBlockchainInfo } from 'src/app/shared/interfaces/blockchainInfo';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrl: './block-info.component.css',
})
export class BlockInfoComponent implements OnInit, OnDestroy {
  blockInfo: IBlockInfo | undefined;
  transactionDetails: ITransactionInfo[] = [];
  blockParam: string | null = null;
  currentPage: number = 1;
  totalPages!: number;
  btcPrice!: number;

  @ViewChild('transactionsContainer') transactionsContainer!: ElementRef;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private insightsService: InsightsService,
    private router: Router,
    private route: ActivatedRoute,
    private notifService: NotificationService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.blockParam = this.route.snapshot.paramMap.get('blockParam');
    if (!this.blockParam) {
      return;
    }

    this.loadingService.show();

    this.insightsService.getBlockchainInfo().subscribe({
      next: (data: IBlockchainInfo) => {
        this.btcPrice = data.bitcoinPrice;
      },
      error: (err: Error) => {
        console.error('Error fetching blockchain info:', err);
      },
    });

    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;

      const fetchBlockInfo = isNaN(+this.blockParam!)
        ? this.insightsService.getBlockInfoByHash(
            this.blockParam!,
            this.currentPage
          )
        : this.insightsService.getBlockInfoByHeight(
            +this.blockParam!,
            this.currentPage
          );

      fetchBlockInfo.subscribe({
        next: (data: IBlockInfo) => {
          this.blockInfo = data;

          this.totalPages = Math.ceil(data.ntx / 5);

          this.fetchTransactionDetails();

          this.loadingService.hide();
        },
        error: (err: Error) => {
          console.error('Error fetching block info:', err);

          this.currentPage = 1;
          this.updateRoute();

          this.loadingService.hide();

          this.router.navigate(['/']);
          return this.notifService.showError('Block info retrieval failed');
        },
      });
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.scrollToTxContainer();
      });

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }

  private scrollToTxContainer() {
    if (this.transactionsContainer) {
      this.transactionsContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  fetchTransactionDetails(): void {
    if (
      !this.blockInfo?.transactions ||
      this.blockInfo.transactions.length === 0
    ) {
      return;
    }

    const requests = this.blockInfo.transactions.map((txId) => {
      return this.insightsService.getTransactionInfo(txId);
    });

    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        this.transactionDetails = results.map((txDetails, index) => {
          let totalSent = 0;
          txDetails.vout.forEach((output: any) => {
            if (
              output.scriptPubKey &&
              output.scriptPubKey.type !== 'nulldata'
            ) {
              totalSent += output.value;
            }
          });

          return {
            txId: this.blockInfo!.transactions[index],
            hash: txDetails.hash,
            size: txDetails.size,
            weight: txDetails.weight,
            version: txDetails.version,
            lockTime: txDetails.lockTime,
            vin: txDetails.vin,
            vout: txDetails.vout,
            hex: txDetails.hex,
            blockHash: txDetails.blockHash,
            confirmations: txDetails.confirmations,
            blockTime: new Date(txDetails.blockTime * 1000),
            time: new Date(txDetails.time * 1000),
            vbytes: txDetails.vbytes,
            direction: {
              receivedAmount: 0,
              sentAmount: totalSent,
            },
          };
        });
      },
      error: (err: Error) => {
        console.error('Error fetching transaction details:', err);
      },
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateRoute();
  }

  updateRoute() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.currentPage,
      },
      queryParamsHandling: 'merge',
    });
  }

  trimTrailingZeros(value: string): string {
    return value.replace(/\.?0+$/, '');
  }

  hexToDecimal(hex: string): string {
    const decimalNumber = parseInt(hex, 16);
    return decimalNumber.toLocaleString();
  }

  onHashClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const hashContent = target.textContent;

    if (!hashContent) {
      return;
    }

    const hash = hashContent.split('Block Hash')[1].trim();

    this.insightsService.getBlockInfoByHash(hash, this.currentPage).subscribe({
      next: (data: IBlockInfo) => {
        this.blockInfo = data;
        this.totalPages = Math.ceil(data.ntx / 5);

        // console.log('Block info by hash fetched:', this.blockInfo);

        this.router.navigate(['/insights/block', hash]);
      },
      error: (err: Error) => {
        console.error('Error fetching block info:', err);
        this.currentPage = 1;
        this.updateRoute();
      },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
