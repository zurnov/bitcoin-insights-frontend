import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SeoService } from 'src/app/shared/services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.update({
      title: 'Privacy Policy | BTC Insights',
      description: 'BTC Insights privacy policy. We do not collect personal data, require registration, or track users. Learn what data our infrastructure logs and which third-party services we use.',
      url: 'https://explore21.com/privacy',
    });
    this.loadingService.hide();
  }
}
