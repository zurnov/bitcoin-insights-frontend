import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { InsightsService } from '../insights.service';
import { IAddressHistory } from 'src/app/shared/interfaces/addressHistory';
import { IAddressBalance } from 'src/app/shared/interfaces/addressBalance';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, forkJoin, takeUntil } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { IBlockchainInfo } from 'src/app/shared/interfaces/blockchainInfo';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrl: './address-info.component.css',
})
export class AddressInfoComponent implements OnInit, OnDestroy {
  addressBalance: IAddressBalance | undefined;
  addressHistory: IAddressHistory | undefined;
  walletAddress: string | null = null;
  currentPage: number = 1;
  totalPages!: number;
  animatedIndex: string | null = null;
  showTooltipId: string | null = null;
  showCopied = false;
  btcPrice!: number;

  private destroy$: Subject<void> = new Subject<void>();

  @ViewChild('transactionsContainer') transactionsContainer!: ElementRef;

  constructor(
    private insightsService: InsightsService,
    private route: ActivatedRoute,
    private router: Router,
    private cbService: ClipboardService,
    private notifService: NotificationService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.walletAddress = this.route.snapshot.paramMap.get('address');
    if (!this.walletAddress) {
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

      this.insightsService
        .getAddressHistory(this.walletAddress as string, this.currentPage)
        .subscribe({
          next: (data: IAddressHistory) => {
            this.addressHistory = data;
            this.totalPages = data.totalPages;

            this.fetchTransactionDetails();

            // console.log('Address history fetched:', this.addressHistory);

            this.loadingService.hide();
          },
          error: (err: Error) => {
            console.error('Error fetching address history:', err);
            this.currentPage = 1;
            this.updateRoute();

            this.loadingService.hide();

            this.router.navigate(['/']);
            return this.notifService.showError('Address info retrieval failed');
          },
        });
    });

    this.insightsService.getAddressBalance(this.walletAddress).subscribe({
      next: (data: IAddressBalance) => {
        this.addressBalance = data;
        // console.log('Address balance fetched:', this.addressBalance);
      },
      error: (err: Error) => {
        console.error('Error fetching address balance:', err);
      },
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
    if (!this.addressHistory?.transactions) {
      return;
    }

    const requests = this.addressHistory.transactions.map((tx) => {
      return this.insightsService.getTransactionInfo(tx.txHash);
    });

    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        results.forEach((txDetails, index) => {
          const direction = this.checkTransactionDirection(
            txDetails,
            this.walletAddress as string
          );

          const isPendingTx =
            !txDetails.blockHash || txDetails.blockHash.length <= 1;

          if (this.addressHistory) {
            this.addressHistory.transactions[index].details = {
              ...txDetails,
              direction,
              pending: isPendingTx,
            };
          }
        });
      },
      error: (err: Error) => {
        console.error('Error fetching transaction details:', err);
      },
    });
  }

  checkTransactionDirection(tx: any, walletAddress: string) {
    let receivedAmount = 0;
    let sentAmount = 0;

    tx.vout.forEach((output: any) => {
      if (output.scriptPubKey.address === walletAddress) {
        receivedAmount += output.value;
      }
    });

    tx.vout.forEach((output: any) => {
      if (
        output.scriptPubKey.address !== walletAddress &&
        receivedAmount == 0
      ) {
        //! only calc sent if nothing received
        sentAmount += output.value;
      }
    });

    return { receivedAmount, sentAmount };
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

  trimTrailingZeros(value: string | number | null): string {
    if (value === null) {
      return '';
    }
    return value.toString().replace(/\.?0+$/, '');
  }

  showCopy(txId: string) {
    this.showTooltipId = txId;
    this.showCopied = false;
  }

  showTooltip(txId: string) {
    this.showTooltipId = txId;
    this.showCopied = true;
    this.copyAndAnimate(txId);

    setTimeout(() => {
      this.showTooltipId = null;
      this.showCopied = false;
    }, 2000);
  }

  hideTooltip() {
    this.showTooltipId = null;
    this.showCopied = false;
  }

  copyAndAnimate(txId: string) {
    this.cbService.copyFromContent(txId);

    this.animatedIndex = txId;

    setTimeout(() => {
      this.animatedIndex = null;
    }, 500);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
