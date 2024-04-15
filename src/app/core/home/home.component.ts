import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxTimelineEvent, NgxTimelineItemPosition } from '@frxjs/ngx-timeline';
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
  lastRefreshTime: Date | undefined;
  timeUntilRefresh: number | undefined;
  private refreshSubscription!: Subscription;
  intervalSubscription: Subscription | undefined;

  blockchainInfo: IBlockchainInfo | undefined;
  btcTimelineEvents: NgxTimelineEvent[] = [
    {
      timestamp: new Date('2009-01-03'),
      title: 'Genesis Block Mined',
      description:
        'Satoshi Nakamoto mines the first block of the Bitcoin blockchain, known as the genesis block.',
      id: 1,
      itemPosition: NgxTimelineItemPosition.ON_LEFT,
    },
    {
      timestamp: new Date('2010-05-22'),
      title: 'First Bitcoin Purchase',
      description:
        'Programmer Laszlo Hanyecz makes the first known commercial transaction using Bitcoin, purchasing two pizzas for 10,000 BTC.',
      id: 2,
      itemPosition: NgxTimelineItemPosition.ON_RIGHT,
    },
    {
      timestamp: new Date('2013-03-18'),
      title: 'Regulatory Guidelines Established',
      description:
        'The US Financial Crimes Enforcement Network (FinCEN) establishes regulatory guidelines for decentralized virtual currencies like Bitcoin.',
      id: 3,
      itemPosition: NgxTimelineItemPosition.ON_LEFT,
    },
    {
      timestamp: new Date('2017-08-01'),
      title: 'SegWit Software Upgrade Activated',
      description:
        'The Segregated Witness (SegWit) software upgrade is activated, intended to support the Lightning Network and improve scalability of Bitcoin.',
      id: 4,
      itemPosition: NgxTimelineItemPosition.ON_RIGHT,
    },
    {
      timestamp: new Date('2020-11-12'),
      title: 'PayPal Adds Support for Bitcoin',
      description:
        'Payment platform PayPal adds support for Bitcoin, allowing users to buy, sell, and hold Bitcoin within their PayPal accounts.',
      id: 5,
      itemPosition: NgxTimelineItemPosition.ON_LEFT,
    },
    {
      timestamp: new Date('2021-09-07'),
      title: 'Bitcoin Becomes Legal Tender in El Salvador',
      description:
        'El Salvador becomes the first country to adopt Bitcoin as legal tender alongside the US dollar.',
      id: 6,
      itemPosition: NgxTimelineItemPosition.ON_RIGHT,
    },
    {
      timestamp: new Date('2023-01-01'),
      title: 'Ordinals on Bitcoin Go Live',
      description:
        'Non-fungible tokens (NFTs) known as ordinals are introduced on the Bitcoin blockchain, allowing for unique digital assets to be created and traded.',
      id: 7,
      itemPosition: NgxTimelineItemPosition.ON_LEFT,
    },
    {
      timestamp: new Date('2024-01-01'),
      title: 'First Spot Bitcoin Begin Trading',
      description:
        'The first 11 US spot Bitcoin exchange-traded funds (ETFs) begin trading on American stock exchanges, offering direct exposure to Bitcoin for investors.',
      id: 8,
      itemPosition: NgxTimelineItemPosition.ON_RIGHT,
    },
  ];

  constructor(
    private insightsService: InsightsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let fetchCounter = 1;
    this.fetchBlockchainInfo(fetchCounter);

    this.intervalSubscription = interval(1000).subscribe(() => {
      this.timeUntilRefresh = Math.floor(
        (this.tenMinsInMilliseconds -
          (new Date().getTime() -
            (this.lastRefreshTime?.getTime() ?? new Date().getTime()))) /
          1000
      );
    });

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
        this.lastRefreshTime = new Date();

        console.log(
          `Blockchain info fetched for the ${fetchCounter} time:`,
          this.blockchainInfo
        );
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
    this.intervalSubscription?.unsubscribe();
    this.refreshSubscription?.unsubscribe();
  }
}
