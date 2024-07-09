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
  blockParam: string | null = null;
  currentPage: number = 1;
  totalPages!: number;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private insightsService: InsightsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.blockParam = this.route.snapshot.paramMap.get('blockParam');
    if (!this.blockParam) {
      return;
    }

    this.route.queryParams.subscribe((params) => {
      this.currentPage = +params['page'] || 1;

      if (isNaN(+this.blockParam!)) {
        this.insightsService
          .getBlockInfoByHash(this.blockParam!, this.currentPage)
          .subscribe({
            next: (data: IBlockInfo) => {
              this.blockInfo = data;
              this.totalPages = Math.ceil(data.ntx / 10);

              // console.log('Block info by hash fetched:', this.blockInfo);
            },
            error: (err: Error) => {
              console.error('Error fetching block info:', err);
              this.currentPage = 1;
              this.updateRoute();
            },
          });
      } else {
        this.insightsService
          .getBlockInfoByHeight(+this.blockParam!, this.currentPage)
          .subscribe({
            next: (data: IBlockInfo) => {
              this.blockInfo = data;
              this.totalPages = Math.ceil(data.ntx / 10);

              // console.log('Block info by height fetched:', this.blockInfo);
            },
            error: (err: Error) => {
              console.error('Error fetching block info:', err);
              this.currentPage = 1;
              this.updateRoute();
            },
          });
      }
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        window.scrollTo(0, 1300);
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
        this.totalPages = Math.ceil(data.ntx / 10);

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
