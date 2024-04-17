import { Component, OnDestroy, OnInit } from '@angular/core';
import { InsightsService } from '../insights.service';
import { IBlockInfo } from 'src/app/shared/interfaces/blockInfo';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-block-info',
  templateUrl: './block-info.component.html',
  styleUrl: './block-info.component.css',
})
export class BlockInfoComponent implements OnInit, OnDestroy {
  blockInfo: IBlockInfo | undefined;
  blockHeight: number | null = null;
  currentPage: number = 1;
  totalPages!: number;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private insightsService: InsightsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.blockHeight = Number(this.route.snapshot.paramMap.get('height'));
    if (!this.blockHeight) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        window.scrollTo(0, 1060);
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
      return;
    }

    this.insightsService.getBlockInfoByHeight(this.blockHeight).subscribe({
      next: (data: IBlockInfo) => {
        this.blockInfo = data;
        // console.log('Block info fetched:', this.blockInfo);
      },
      error: (err: Error) => {
        console.error('Error fetching block info:', err);
      },
    });
  }

  onTxHashClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const txHashContent = target.textContent?.trim();

    this.router.navigate(['/insights/transaction', txHashContent]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
