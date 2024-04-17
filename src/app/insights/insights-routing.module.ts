import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultsComponent } from './results/results.component';
import { BlockInfoComponent } from './block-info/block-info.component';

const routes: Routes = [
  {
    path: ':address',
    component: ResultsComponent,
  },
  {
    path: 'block/:height',
    component: BlockInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsightsRoutingModule {}
