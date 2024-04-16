import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'difficultyConversion',
})
export class DifficultyConversionPipe implements PipeTransform {
  transform(val: number): string {
    const trillions = val / Math.pow(10, 12);
    return trillions.toFixed(2) + ' T';
  }
}
