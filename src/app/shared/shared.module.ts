import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashRateConversionPipe } from './pipes/hash-rate-conversion.pipe';
import { DifficultyConversionPipe } from './pipes/difficulty-conversion.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    HashRateConversionPipe,
    DifficultyConversionPipe,
    SpinnerComponent,
  ],
  imports: [CommonModule],
  exports: [HashRateConversionPipe, DifficultyConversionPipe, SpinnerComponent],
})
export class SharedModule {}
