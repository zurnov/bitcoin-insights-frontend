import { Component } from '@angular/core';
import { InsightsService } from '../insights.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-mining-calculator',
  templateUrl: './mining-calculator.component.html',
  // styleUrls: ['./mining-calculator.component.css']
})
export class MiningCalculatorComponent {
  /**
   * Expected number of Bitcoin blocks per day (24 hours * 6 blocks per hour).
   */
  private static readonly BLOCKS_PER_DAY = 144;

  hashRate: number | null = null;
  hashRateUnits = [
    { value: 'M', label: 'MH/s', multiplier: 1e6 },
    { value: 'G', label: 'GH/s', multiplier: 1e9 },
    { value: 'T', label: 'TH/s', multiplier: 1e12 },
    { value: 'P', label: 'PH/s', multiplier: 1e15 },
    { value: 'E', label: 'EH/s', multiplier: 1e18 }
  ];
  selectedUnit = this.hashRateUnits[2].value; // Default to TH/s

  calculationResult: {
    daily: number;
    weekly: number;
    monthly: number;
  } | null = null;
  showResult = false;

  /**
   * Lottery odds:
   * - 6/49: Odds of winning jackpot are 1 in 13,983,816. Probability = 1 / 13,983,816 ≈ 0.0000000715 (rounded to 0.00000715 for easier comparison).
   *   Source: https://en.wikipedia.org/wiki/Lottery_mathematics
   * - EuroMillions (Jackpot): Odds are 1 in 139,838,160. Probability = 1 / 139,838,160 ≈ 0.00000000715 (rounded to 0.000000715).
   *   Source: https://en.wikipedia.org/wiki/EuroMillions
   * - US Powerball (Jackpot): Odds are 1 in 292,201,338. Probability = 1 / 292,201,338 ≈ 0.00000000342 (rounded to 0.000000342).
   *   Source: https://en.wikipedia.org/wiki/Powerball
   */
  lotteries = [
    { name: '6/49', chance: 0.00000715 }, // 1 in 13,983,816
    { name: 'EuroMillions (Jackpot)', chance: 0.000000715 }, // 1 in 139,838,160
    { name: 'US Powerball (Jackpot)', chance: 0.000000342 } // 1 in 292,201,338
  ];

  lotteryComparisons: {
    name: string;
    comparisonFactor: number;
    moreLikely: boolean;
  }[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  networkHashRateEH: number | null = null;

  constructor(private insightsService: InsightsService) {}

  calculate() {
    if (!this.hashRate || this.hashRate <= 0) {
      this.showResult = false;
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.showResult = false;

    this.insightsService.getBlockchainInfo().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data) => {
        this.networkHashRateEH = data.networkHashPerSecond / 1e18;
        const networkHashRate = data.networkHashPerSecond;

        const selectedUnitData = this.hashRateUnits.find(u => u.value === this.selectedUnit);
        if (!selectedUnitData) {
            this.errorMessage = 'Invalid unit selected.';
            return;
        }
        const userHashRate = this.hashRate! * selectedUnitData.multiplier;

        const userShare = userHashRate / networkHashRate;

        const blocksPerDay = MiningCalculatorComponent.BLOCKS_PER_DAY;
        const dailyChance = userShare * blocksPerDay * 100;
        
        this.calculationResult = {
          daily: dailyChance,
          weekly: dailyChance * 7,
          monthly: dailyChance * 30,
        };

        this.lotteryComparisons = this.lotteries.map(lottery => {
          const miningChance = dailyChance;
          const lotteryChance = lottery.chance;
          const miningIsMoreLikely = miningChance >= lotteryChance;

          const comparisonFactor = miningIsMoreLikely 
            ? miningChance / lotteryChance 
            : lotteryChance / miningChance;

          return {
            name: lottery.name,
            comparisonFactor: comparisonFactor,
            moreLikely: miningIsMoreLikely
          };
        });

        this.showResult = true;
      },
      error: (err) => {
        this.errorMessage = 'Could not fetch network data. Please try again later.';
        console.error(err);
      }
    });
  }
}
