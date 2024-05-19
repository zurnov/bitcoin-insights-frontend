import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HashRateConversionPipe } from './pipes/hash-rate-conversion.pipe';
import { DifficultyConversionPipe } from './pipes/difficulty-conversion.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from './pipes/truncate.pipe';
import { FixedLengthNumberPipe } from './pipes/fixed-length-number.pipe';

@NgModule({
  declarations: [
    HashRateConversionPipe,
    DifficultyConversionPipe,
    FixedLengthNumberPipe,
    TruncatePipe,
    SpinnerComponent,
    PaginationComponent,
  ],
  imports: [CommonModule, FormsModule],
  exports: [
    HashRateConversionPipe,
    DifficultyConversionPipe,
    FixedLengthNumberPipe,
    TruncatePipe,
    SpinnerComponent,
    PaginationComponent,
  ],
})
export class SharedModule {}
