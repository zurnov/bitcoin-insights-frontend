import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 10): string {
    if (value.length <= maxLength) {
      return value;
    }

    const firstPart = value.substring(0, 10);
    const lastPart = value.substring(value.length - 10);
    return `${firstPart}...${lastPart}`;
  }
}
