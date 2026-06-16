import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SeoService } from 'src/app/shared/services/seo.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  constructor(
    private loadingService: LoadingService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.update({
      title: 'About BTC Insights – Free Bitcoin Blockchain Explorer',
      description: 'Learn about BTC Insights: a free, open-access Bitcoin blockchain explorer for address lookup, transaction tracking, block exploration, and mining statistics.',
      url: 'https://explore21.com/about',
    });
    this.loadingService.hide();
  }
}
