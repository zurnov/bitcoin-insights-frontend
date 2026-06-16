import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SeoService } from 'src/app/shared/services/seo.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './terms.component.html',
})
export class TermsComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.update({
      title: 'Terms of Service | BTC Insights',
      description: 'Terms of service for BTC Insights. Data is provided for informational purposes only and does not constitute financial advice. Read our acceptable use policy and liability disclaimer.',
      url: 'https://explore21.com/terms',
    });
    this.loadingService.hide();
  }
}
