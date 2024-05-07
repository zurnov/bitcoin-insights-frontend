import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 10): string {
    if (value.length <= maxLength) {
      return value;
    }

    const firstPart = value.substring(0, 12);
    const lastPart = value.substring(value.length - 12);
    return `${firstPart}...${lastPart}`;
  }
}
