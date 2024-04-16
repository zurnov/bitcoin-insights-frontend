import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsightsRoutingModule } from './insights-routing.module';
import { ResultsComponent } from './results/results.component';
import { HttpClientModule } from '@angular/common/http';
import { InsightsService } from './insights.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ResultsComponent],
  imports: [
    CommonModule,
    InsightsRoutingModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [InsightsService],
})
export class InsightsModule {}
