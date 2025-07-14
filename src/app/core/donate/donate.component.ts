import { Component } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { LoadingService } from 'src/app/shared/services/loading.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.css',
})
export class DonateComponent {
  btcAddress = 'bc1q409g2sesns7069w2vqz8mjfdtzwqk4r47snrxk';
  lighthingAddress = 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhh2um9v3kh2um9w4knqvc7842z9';

  copiedAddress: 'btc' | 'lightning' | null = null;

  constructor(
    private loadingService: LoadingService,
    private cbService: ClipboardService
  ) {
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
