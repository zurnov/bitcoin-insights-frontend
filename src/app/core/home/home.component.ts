import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Observable, Subscription, combineLatest, interval } from 'rxjs';
import { InsightsService } from 'src/app/insights/insights.service';
import { addressesExamples } from 'src/app/shared/helpers/addressesExamples';
import { blocksExamples } from 'src/app/shared/helpers/blocksExamples';
import { transactionsExamples } from 'src/app/shared/helpers/transactionsExamples';
import { IBlockInfo } from 'src/app/shared/interfaces/blockInfo';
import { IBlockchainInfo } from 'src/app/shared/interfaces/blockchainInfo';
import { ITransactionInfo } from 'src/app/shared/interfaces/transactionInfo';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tenMinsInMilliseconds = 10 * 60 * 1000;
  animatedIndex: string | null = null;
  showTooltipId: string | null = null;
  showCopied = false;
  btcPrice: number | undefined;

  private refreshSubscription!: Subscription;

  blockchainInfo: IBlockchainInfo | undefined;
  latestBlocks: IBlockInfo[] = [];
  latestTransactions: ITransactionInfo[] = [];

  examplesBtc = {
    addresses: addressesExamples,
    blocks: blocksExamples,
    transactions: transactionsExamples,
  };

  @ViewChild('searchInput', { static: false })
  searchInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private insightsService: InsightsService,
    private router: Router,
    private cbService: ClipboardService,
    private el: ElementRef,
    private notifService: NotificationService,
    private loadingService: LoadingService
  ) {}

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: any) {
    const clickedInside = this.el.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.blurInput();
    }
  }

  ngOnInit(): void {
    this.loadingService.show();

    let fetchCounter = 1;
    this.fetchBlockchainInfo(fetchCounter);

    this.refreshSubscription = interval(this.tenMinsInMilliseconds).subscribe(
      () => {
        fetchCounter++;
        this.fetchBlockchainInfo(fetchCounter);
      }
    );

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }

  onExampleClick(type: 'address' | 'block' | 'transaction') {
    let selectedVal: string;

    switch (type) {
      case 'address':
        const randomIndexAddress = Math.floor(
          Math.random() * this.examplesBtc.addresses.length
        );
        selectedVal = this.examplesBtc.addresses[randomIndexAddress];
        break;
      case 'block':
        const randomIndexBlock = Math.floor(
          Math.random() * this.examplesBtc.blocks.length
        );
        selectedVal = this.examplesBtc.blocks[randomIndexBlock];
        break;
      case 'transaction':
        const randomIndexTransaction = Math.floor(
          Math.random() * this.examplesBtc.transactions.length
        );
        selectedVal = this.examplesBtc.transactions[randomIndexTransaction];
        break;
      default:
        return;
    }

    if (this.searchInputRef) {
      this.searchInputRef.nativeElement.value = selectedVal;
    }
  }

  blurInput() {
    const inputElement = this.el.nativeElement.querySelector('.main-search');
    if (inputElement) {
      inputElement.blur();
    }
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

  fetchBlockchainInfo(fetchCounter: number) {
    this.insightsService.getBlockchainInfo().subscribe({
      next: (data: IBlockchainInfo) => {
        this.blockchainInfo = data;
        this.btcPrice = this.blockchainInfo.bitcoinPrice;

        const latestBlockHeight = data.blocks;

        const blockHeights = Array.from(
          { length: 4 },
          (_, index) => latestBlockHeight - 1 - index
        );

        const blockInfoRequests: Observable<IBlockInfo>[] = blockHeights.map(
          (height) => {
            return this.insightsService.getBlockInfoByHeight(height, 1, 1);
          }
        );

        combineLatest(blockInfoRequests).subscribe({
          next: (blockInfos: IBlockInfo[]) => {
            this.latestBlocks = blockInfos;
            this.fetchLatestBlockTXs(latestBlockHeight);
          },
          error: (err: Error) => {
            console.error('Error fetching latest blocks', err);
          },
        });

        this.loadingService.hide();
      },
      error: (err: Error) => {
        this.loadingService.hide();
        console.error('Error fetching blockchain info', err);
      },
    });
  }

  fetchLatestBlockTXs(latestBlockHeight: number) {
    this.insightsService
      .getBlockInfoByHeight(latestBlockHeight, 1, 5)
      .subscribe({
        next: (latestBlockInfo: IBlockInfo) => {
          this.latestBlocks = [latestBlockInfo, ...this.latestBlocks];

          const txIds = latestBlockInfo.transactions;

          const txRequests: Observable<ITransactionInfo>[] = txIds.map((txId) =>
            this.insightsService.getTransactionInfo(txId)
          );

          combineLatest(txRequests).subscribe({
            next: (transactions: ITransactionInfo[]) => {
              this.latestTransactions = transactions;
              console.log(
                'Latest block transactions:',
                this.latestTransactions
              );
            },
            error: (err: Error) => {
              console.error('Error fetching tx details', err);
            },
          });
        },
        error: (err: Error) => {
          console.error('Error fetching latest block TXs', err);
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
    return this.notifService.showError(
      'Enter valid query - BTC address, transaction, or block'
    );
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
    const regex =
      /\b((bc|tb)(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|([13]|[mn2])[a-km-zA-HJ-NP-Z1-9]{25,39})\b/;
    return regex.test(query);
  }

  trimTrailingZeros(value: string): string {
    return value.replace(/\.?0+$/, '');
  }

  calculateTotalValue(tx: any): number {
    let totalValue = 0;
    for (const output of tx.vout) {
      if (output.value > 0) {
        totalValue += output.value;
      }
    }
    return totalValue;
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }
}
