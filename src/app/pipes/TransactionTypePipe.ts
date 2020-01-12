import { Pipe, PipeTransform } from '@angular/core';
import { TransactionTypes } from '../models/transactionType';

@Pipe({
  name: 'transactionTypePipe'
})

export class TransactionTypePipe implements PipeTransform {
  transform(value: any): string {
    const transactionType = TransactionTypes.find(function(x) { return x.value === value; });
    return transactionType.name;
  }
}