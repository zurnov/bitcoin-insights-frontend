import { Component, OnDestroy, OnInit } from '@angular/core';
import { InsightsService } from '../insights.service';
import { IAddressHistory } from 'src/app/shared/interfaces/addressHistory';
import { IAddressBalance } from 'src/app/shared/interfaces/addressBalance';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent implements OnInit, OnDestroy {
  addressBalance: IAddressBalance | undefined;
  addressHistory: IAddressHistory | undefined;
  walletAddress: string | null = null;
  currentPage: number = 1;
  totalPages!: number;

  private destroy$: Subject<void> = new Subject<void>();

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

    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;

      this.insightsService
        .getAddressHistory(this.walletAddress as string, this.currentPage)
        .subscribe({
          next: (data: IAddressHistory) => {
            this.addressHistory = data;
            this.totalPages = data.totalPages;

            // console.log('Address history fetched:', this.addressHistory);
          },
          error: (err: Error) => {
            console.error('Error fetching address history:', err);
            this.currentPage = 1;
            this.updateRoute();
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
        window.scrollTo(0, 320);
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

  onBlockHeightClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const blockHeight = target.textContent;

    if (blockHeight) {
      const matchedHeight = (blockHeight.match(/\d+/) ?? [])[0];
      this.router.navigate(['/insights/block', matchedHeight]);
    }
  }

  onTxHashClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const txHashContent = target.textContent;

    if (txHashContent) {
      const parts = txHashContent.split('Transaction Hash');
      if (parts.length > 1) {
        const txHash = parts[1].trim();
        this.router.navigate(['/insights/transaction', txHash]);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
