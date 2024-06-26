import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsightsRoutingModule } from './insights-routing.module';
import { AddressInfoComponent } from './address-info/address-info.component';
import { HttpClientModule } from '@angular/common/http';
import { InsightsService } from './insights.service';
import { SharedModule } from '../shared/shared.module';
import { BlockInfoComponent } from './block-info/block-info.component';
import { TransactionInfoComponent } from './transaction-info/transaction-info.component';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [
    AddressInfoComponent,
    BlockInfoComponent,
    TransactionInfoComponent,
  ],
  imports: [
    CommonModule,
    InsightsRoutingModule,
    HttpClientModule,
    SharedModule,
    ClipboardModule,
  ],
  providers: [InsightsService],
})
export class InsightsModule {}
