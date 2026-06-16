import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';

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
    loadComponent: () =>
      import('./core/donate/donate.component').then((m) => m.DonateComponent),
    data: { title: 'Donate' },
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./core/about/about.component').then((m) => m.AboutComponent),
    data: { title: 'About' },
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./core/privacy/privacy.component').then((m) => m.PrivacyComponent),
    data: { title: 'Privacy Policy' },
  },
  {
    path: 'terms',
    loadComponent: () =>
      import('./core/terms/terms.component').then((m) => m.TermsComponent),
    data: { title: 'Terms of Service' },
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./core/faq/faq.component').then((m) => m.FaqComponent),
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
