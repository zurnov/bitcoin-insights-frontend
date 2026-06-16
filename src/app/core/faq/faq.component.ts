import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { SeoService } from 'src/app/shared/services/seo.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './faq.component.html',
})
export class FaqComponent implements OnInit {
  faqs = [
    {
      question: 'What is BTC Insights?',
      answer: 'BTC Insights is a free Bitcoin blockchain explorer at explore21.com. It lets you look up Bitcoin addresses, track transactions, browse blocks, and estimate solo mining profitability — all without creating an account.',
      open: true,
    },
    {
      question: 'How do I look up a Bitcoin address?',
      answer: 'Type or paste a Bitcoin address into the search bar on the home page and press Enter. You\'ll see the address balance and a paginated history of all associated transactions.',
      open: false,
    },
    {
      question: 'How do I track a Bitcoin transaction?',
      answer: 'Paste the transaction hash (a 64-character hex string) into the search bar. The transaction page shows inputs, outputs, total value transferred, fee paid, and the number of confirmations.',
      open: false,
    },
    {
      question: 'How do I look up a Bitcoin block?',
      answer: 'Enter a block height (e.g. 840000) or a block hash into the search bar. The block page shows the list of transactions in that block, the miner reward, timestamp, and block metadata.',
      open: false,
    },
    {
      question: 'What is the mining calculator?',
      answer: 'The mining calculator estimates your probability of finding a Bitcoin block if you mine solo. Enter your hashrate and unit (MH/s, GH/s, TH/s, etc.) and the calculator computes your daily, weekly, and monthly chances using live network difficulty data.',
      open: false,
    },
    {
      question: 'Is my search history stored?',
      answer: 'No. BTC Insights does not store the addresses or transactions you search. Bitcoin blockchain data is public by design — it exists on the network regardless of whether you look it up here. See our Privacy page for full details.',
      open: false,
    },
    {
      question: 'How current is the data?',
      answer: 'Data is sourced directly from a Bitcoin full node and reflects the network state at the time of your request. The home page refreshes blockchain statistics every 10 minutes. New blocks appear approximately every 10 minutes.',
      open: false,
    },
    {
      question: 'What is the Bitcoin mempool?',
      answer: 'The mempool (memory pool) is the waiting area for unconfirmed transactions. When you send Bitcoin, your transaction first enters the mempool. Miners pick transactions from the mempool to include in the next block, usually prioritising higher-fee transactions.',
      open: false,
    },
    {
      question: 'Why is a transaction marked as "Pending"?',
      answer: 'A pending transaction has been broadcast to the Bitcoin network but has not yet been included in a block. It remains pending until a miner includes it, which can take seconds to hours depending on the fee rate and network congestion.',
      open: false,
    },
    {
      question: 'Is BTC Insights free?',
      answer: 'Yes, completely. There are no ads, no subscription tiers, and no data paywalls. If you find the service useful, you can support it through a voluntary donation on the Donate page.',
      open: false,
    },
  ];

  toggle(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  constructor(
    private loadingService: LoadingService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.update({
      title: 'FAQ – Bitcoin Explorer Questions Answered | BTC Insights',
      description: 'Frequently asked questions about BTC Insights. Learn how to look up Bitcoin addresses, track transactions, explore blocks, use the mining calculator, and more.',
      url: 'https://explore21.com/faq',
    });
    this.loadingService.hide();
  }
}
