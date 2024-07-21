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
  ethAddress = '0xD3C22260D052eaFab37E571eA0B9cdf57EA55a4C';

  copiedAddress: 'btc' | 'eth' | null = null;

  constructor(
    private loadingService: LoadingService,
    private cbService: ClipboardService
  ) {
    this.loadingService.hide();
  }

  copyAddress(address: string, type: 'btc' | 'eth') {
    this.cbService.copy(address);
    this.copiedAddress = type;

    setTimeout(() => {
      this.copiedAddress = null;
    }, 2000);
  }
}
