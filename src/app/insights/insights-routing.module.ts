import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressInfoComponent } from './address-info/address-info.component';
import { BlockInfoComponent } from './block-info/block-info.component';
import { TransactionInfoComponent } from './transaction-info/transaction-info.component';

const routes: Routes = [
  {
    path: 'address/:address',
    component: AddressInfoComponent,
  },
  {
    path: 'block/:blockParam',
    component: BlockInfoComponent,
  },
  {
    path: 'transaction/:txHash',
    component: TransactionInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsightsRoutingModule {}
