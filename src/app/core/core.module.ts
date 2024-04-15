import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { NgxTimelineModule } from '@frxjs/ngx-timeline';

@NgModule({
  declarations: [HomeComponent, HeaderComponent, MobileMenuComponent],
  imports: [CommonModule, RouterModule, SharedModule, NgxTimelineModule],
  providers: [],
  exports: [HeaderComponent],
})
export class CoreModule {}