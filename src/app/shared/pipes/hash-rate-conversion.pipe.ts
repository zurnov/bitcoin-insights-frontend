import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hashRateConversion',
})
export class HashRateConversionPipe implements PipeTransform {
  transform(val: number): number {
    let calc = Number(val / Math.pow(10, 18)).toFixed(2);
    return Number(calc);
  }
}
