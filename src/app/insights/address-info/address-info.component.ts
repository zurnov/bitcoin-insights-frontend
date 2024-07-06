import { Component, OnDestroy, OnInit } from '@angular/core';
import { InsightsService } from '../insights.service';
import { IAddressHistory } from 'src/app/shared/interfaces/addressHistory';
import { IAddressBalance } from 'src/app/shared/interfaces/addressBalance';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { ClipboardService } from 'ngx-clipboard';

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
  isLoading = false;
  btcPrice!: number;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private insightsService: InsightsService,
    private route: ActivatedRoute,
    private router: Router,
    private cbService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.walletAddress = this.route.snapshot.paramMap.get('address');
    if (!this.walletAddress) {
      return;
    }

    this.getBtcPrice()

    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;
      this.isLoading = true;

      this.insightsService
        .getAddressHistory(this.walletAddress as string, this.currentPage)
        .subscribe({
          next: (data: IAddressHistory) => {
            this.addressHistory = data;
            this.totalPages = data.totalPages;
            this.isLoading = false;

            // console.log('Address history fetched:', this.addressHistory);
          },
          error: (err: Error) => {
            console.error('Error fetching address history:', err);
            this.currentPage = 1;
            this.updateRoute();
            this.isLoading = false;
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
        alert('Error fetching address balance');
        this.router.navigate(['/']);
      },
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        window.scrollTo(0, 450);
      });
  }

  async getBtcPrice(): Promise<void> {
    try {
      const response: any = await this.insightsService.getBtcCurrentPrice();
      this.btcPrice = response.price;
    } catch (err) {
      console.log('error getting btc price from service:', err);
    }
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

  trimTrailingZeros(value: string | null): string {
    if (value === null) {
      return '';
    }
    return value.replace(/\.?0+$/, '');
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
