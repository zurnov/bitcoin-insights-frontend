import { Component } from '@angular/core';
import { ITransactionInfo } from 'src/app/shared/interfaces/transactionInfo';
import { InsightsService } from '../insights.service';
import { ActivatedRoute } from '@angular/router';
import { IBlockInfo } from 'src/app/shared/interfaces/blockInfo';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrl: './transaction-info.component.css',
})
export class TransactionInfoComponent {
  transactionInfo: ITransactionInfo | undefined;
  blockInfo: IBlockInfo | undefined;
  txHash!: string;
  totalAmount: number = 0;
  isLoading = true;
  vinDetails: { address: string; amount: number }[] = [];

  constructor(
    private insightsService: InsightsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;

    this.txHash = this.route.snapshot.paramMap.get('txHash') || '';
    if (!this.txHash) {
      return;
    }

    this.insightsService.getTransactionInfo(this.txHash).subscribe({
      next: (data: ITransactionInfo) => {
        this.transactionInfo = data;

        if (this.transactionInfo && this.transactionInfo.vout) {
          this.totalAmount = this.calculateTotalAmount(
            this.transactionInfo.vout
          );
        }

        if (this.transactionInfo && this.transactionInfo.vin) {
          this.fetchVinDetails(this.transactionInfo.vin);
        }

        if (this.transactionInfo && this.transactionInfo.blockHash) {
          this.insightsService
            .getBlockInfoByHash(this.transactionInfo.blockHash)
            .subscribe({
              next: (blockData: any) => {
                this.blockInfo = blockData;
                // console.log('Block info fetched:', this.blockInfo);
              },
              error: (err: Error) => {
                console.error('Error fetching block info:', err);
              },
            });
        }

        this.isLoading = false;

        // console.log('Transaction info fetched:', this.transactionInfo);
      },
      error: (err: Error) => {
        this.isLoading = false;
        console.error('Error fetching transaction info:', err);
      },
    });
  }

  private fetchVinDetails(vin: any[]) {
    const requests = vin.map((input) =>
      this.insightsService.getTransactionInfo(input.txId)
    );

    forkJoin(requests).subscribe({
      next: (results: any[]) => {
        results.forEach((txDetails, index) => {
          const voutIndex = vin[index].vout;
          const vout = txDetails.vout[voutIndex];

          if (vout && vout.scriptPubKey && vout.scriptPubKey.address) {
            this.vinDetails.push({
              address: vout.scriptPubKey.address,
              amount: vout.value,
            });
          }
        });

        console.log('vin details constructed', this.vinDetails);
      },
      error: (err: Error) => {
        console.error('Error fetching vin details:', err);
      },
    });
  }

  private calculateTotalAmount(vout: any[]): number {
    let totalAmount = 0;
    vout.forEach((output: any) => {
      if (output.scriptPubKey && output.scriptPubKey.type !== 'nulldata') {
        totalAmount += output.value;
      }
    });
    return totalAmount;
  }
}
