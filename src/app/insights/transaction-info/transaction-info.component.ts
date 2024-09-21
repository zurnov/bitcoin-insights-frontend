import { Component } from '@angular/core';
import { ITransactionInfo } from 'src/app/shared/interfaces/transactionInfo';
import { InsightsService } from '../insights.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IBlockInfo } from 'src/app/shared/interfaces/blockInfo';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { IBlockchainInfo } from 'src/app/shared/interfaces/blockchainInfo';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrl: './transaction-info.component.css',
})
export class TransactionInfoComponent {
  transactionInfo: ITransactionInfo | undefined;
  isPendingTx: boolean = false;
  blockInfo: IBlockInfo | undefined;
  txHash!: string;
  totalAmount: number = 0;
  totalInputAmount: number = 0;
  fee: number = 0;
  btcPrice!: number;
  vinDetails: { address: string; amount: number }[] = [];

  constructor(
    private insightsService: InsightsService,
    private route: ActivatedRoute,
    private router: Router,
    private notifService: NotificationService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.txHash = this.route.snapshot.paramMap.get('txHash') || '';
    if (!this.txHash) {
      return;
    }

    this.loadingService.show();

    this.insightsService.getBlockchainInfo().subscribe({
      next: (data: IBlockchainInfo) => {
        this.btcPrice = data.bitcoinPrice;
      },
      error: (err: Error) => {
        console.error('Error fetching blockchain info:', err);
      },
    });

    this.insightsService.getTransactionInfo(this.txHash).subscribe({
      next: (data: ITransactionInfo) => {
        this.transactionInfo = data;

        if (
          !this.transactionInfo.blockHash ||
          this.transactionInfo.blockHash.length <= 1
        ) {
          this.isPendingTx = true;
        }

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

        // console.log('Transaction info fetched:', this.transactionInfo);
        this.loadingService.hide();
      },
      error: (err: Error) => {
        console.error('Error fetching transaction info:', err);

        this.loadingService.hide();

        this.router.navigate(['/']);
        return this.notifService.showError('Transaction info retrieval failed');
      },
    });

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }

  private fetchVinDetails(vin: any[]) {
    const requests = vin.map((input) =>
      this.insightsService.getTransactionInfo(input.txId)
    );

    forkJoin(requests).subscribe({
      next: (transactions: any[]) => {
        this.vinDetails = transactions.map((transaction, index) => {
          const vout = transaction.vout.find(
            (output: any) => output.n === vin[index].vout
          );
          return {
            address: vout?.scriptPubKey?.address || 'N/A',
            amount: vout?.value || 0,
          };
        });

        this.totalInputAmount = this.vinDetails.reduce(
          (sum, vin) => sum + vin.amount,
          0
        );
        this.fee = this.formatFee(this.totalInputAmount - this.totalAmount);
      },
      error: (err: Error) => {
        console.error('Error fetching vin details:', err);
      },
    });
  }

  private formatFee(fee: number): number {
    return parseFloat(fee.toFixed(8));
  }

  trimTrailingZeros(value: string): string {
    return value.replace(/\.?0+$/, '');
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
