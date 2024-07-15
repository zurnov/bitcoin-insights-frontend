import { Component } from '@angular/core';
import { ITransactionInfo } from 'src/app/shared/interfaces/transactionInfo';
import { InsightsService } from '../insights.service';
import { ActivatedRoute } from '@angular/router';
import { IBlockInfo } from 'src/app/shared/interfaces/blockInfo';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrl: './transaction-info.component.css',
})
export class TransactionInfoComponent {
  transactionInfo: ITransactionInfo | undefined;
  blockInfo: IBlockInfo | undefined;
  txHash!: string;

  constructor(
    private insightsService: InsightsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.txHash = this.route.snapshot.paramMap.get('txHash') || '';
    if (!this.txHash) {
      return;
    }

    this.insightsService.getTransactionInfo(this.txHash).subscribe({
      next: (data: ITransactionInfo) => {
        this.transactionInfo = data;

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
      },
      error: (err: Error) => {
        console.error('Error fetching transaction info:', err);
      },
    });
  }
}
