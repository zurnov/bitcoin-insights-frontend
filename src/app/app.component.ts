import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router, private pageTitle: Title) {
    this.router.events
      .pipe(
        filter(
          (event): event is ActivationStart => event instanceof ActivationStart
        ),
        map((event) => event.snapshot.data?.['title']),
        map((title) => (title ? `${title} • BTC Insights` : 'BTC Insights'))
      )
      .subscribe((newTitle) => {
        this.pageTitle.setTitle(newTitle);
      });
  }
}
