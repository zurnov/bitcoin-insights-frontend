import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { DonateComponent } from './core/donate/donate.component';
import { AboutComponent } from './core/about/about.component';
import { PrivacyComponent } from './core/privacy/privacy.component';
import { TermsComponent } from './core/terms/terms.component';
import { FaqComponent } from './core/faq/faq.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'insights',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'insights',
    loadChildren: () =>
      import('./insights/insights.module').then((m) => m.InsightsModule),
  },
  {
    path: 'donate',
    component: DonateComponent,
    data: { title: 'Donate' },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'About' },
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: { title: 'Privacy Policy' },
  },
  {
    path: 'terms',
    component: TermsComponent,
    data: { title: 'Terms of Service' },
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: { title: 'FAQ' },
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      // scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
