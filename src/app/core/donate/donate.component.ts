import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SeoService } from 'src/app/shared/services/seo.service';

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, ClipboardModule],
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.css',
})
export class DonateComponent {
  btcAddress = 'bc1qpkqvjudd7wnxae0dncww37chmak7wqfyks3jt8';
  lightningAddress = 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhh2um9v3kh2um9w4knqvc7842z9';

  copiedAddress: 'btc' | 'lightning' | null = null;

  constructor(
    private loadingService: LoadingService,
    private cbService: ClipboardService,
    private seoService: SeoService
  ) {
    this.seoService.update({
      title: 'Support BTC Insights – Donate Bitcoin | BTC Insights',
      description: 'Support BTC Insights, a free Bitcoin blockchain explorer. Donate via Bitcoin on-chain or Lightning Network to help keep the service running.',
      url: 'https://explore21.com/donate',
    });
    this.loadingService.hide();

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }

  copyAddress(address: string, type: 'btc' | 'lightning') {
    this.cbService.copy(address);
    this.copiedAddress = type;

    setTimeout(() => {
      this.copiedAddress = null;
    }, 2000);
  }
}
