import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { InsightsService } from '../insights/insights.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { ClipboardModule } from 'ngx-clipboard';
import { DonateComponent } from './donate/donate.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    MobileMenuComponent,
    FooterComponent,
    DonateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    ClipboardModule,
  ],
  providers: [InsightsService],
  exports: [HeaderComponent, FooterComponent],
})
export class CoreModule {}
