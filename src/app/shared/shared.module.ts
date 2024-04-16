import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashRateConversionPipe } from './pipes/hash-rate-conversion.pipe';
import { DifficultyConversionPipe } from './pipes/difficulty-conversion.pipe';

@NgModule({
  declarations: [HashRateConversionPipe, DifficultyConversionPipe],
  imports: [CommonModule],
  exports: [HashRateConversionPipe, DifficultyConversionPipe],
})
export class SharedModule {}
