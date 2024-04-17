import { Component } from '@angular/core';
import { ITransactionInfo } from 'src/app/shared/interfaces/transactionInfo';
import { InsightsService } from '../insights.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrl: './transaction-info.component.css',
})
export class TransactionInfoComponent {
  transactionInfo: ITransactionInfo | undefined;
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

        console.log('Transaction info fetched:', this.transactionInfo);
      },
      error: (err: Error) => {
        console.error('Error fetching transaction info:', err);
      },
    });
  }
}
