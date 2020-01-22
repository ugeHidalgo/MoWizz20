import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'euroCurrencyPipe'
})

export class EuroCurrencyPipe implements PipeTransform {
  transform(
      value: any,
      currencyCode: string = 'EUR',
      display:
        | 'code'
        | 'symbol'
        | 'symbol-narrow'
        | string
        | boolean = 'symbol',
      digitsInfo: string = '0.2-2',
      locale: string = 'es'
      ): string | null {
    return formatCurrency(value, locale, getCurrencySymbol(currencyCode, 'wide'), currencyCode, digitsInfo);
  }
}