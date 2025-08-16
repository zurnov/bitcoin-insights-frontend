import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddressInfoComponent } from './address-info/address-info.component';
import { BlockInfoComponent } from './block-info/block-info.component';
import { TransactionInfoComponent } from './transaction-info/transaction-info.component';
import { MiningCalculatorComponent } from './mining-calculator/mining-calculator.component';

const routes: Routes = [
  {
    path: 'address/:address',
    component: AddressInfoComponent,
    data: { title: 'Address' },
  },
  {
    path: 'block/:blockParam',
    component: BlockInfoComponent,
    data: { title: 'Block' },
  },
  {
    path: 'transaction/:txHash',
    component: TransactionInfoComponent,
    data: { title: 'Transaction' },
  },
  {
    path: 'mining-calculator',
    component: MiningCalculatorComponent,
    data: { title: 'Mining Calculator' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsightsRoutingModule {}
