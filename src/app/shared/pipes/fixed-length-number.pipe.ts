import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixedLengthNumber',
})
export class FixedLengthNumberPipe implements PipeTransform {
  transform(value: number, length: number = 8): string {
    if (!value) return '0'.repeat(length);

    let valueStr = value.toString();

    if (valueStr.length <= length) {
      return valueStr;
    }

    const parts = valueStr.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    if (integerPart.length >= length) {
      return integerPart.slice(0, length);
    }

    const requiredDecimalLength = length - integerPart.length - 1;
    const formattedDecimalPart = decimalPart.slice(0, requiredDecimalLength);

    return `${integerPart}.${formattedDecimalPart}`;
  }
}
