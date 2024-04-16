import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DifficultyConversionPipe } from './pipes/difficulty-conversion.pipe';

@NgModule({
  declarations: [DifficultyConversionPipe],
  imports: [CommonModule],
  exports: [DifficultyConversionPipe],
})
export class SharedModule {}
