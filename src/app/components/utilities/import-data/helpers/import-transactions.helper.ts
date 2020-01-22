import { Observable } from 'rxjs';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { Transaction } from 'src/app/models/transaction';
import { ImportTransaction } from '../models/import.transaction';

export class ImportTransactionsHelper {

  fieldNames: string[];

  constructor(
    private service: TransactionsService
  ) { }

  import(data): Observable<Transaction[]> {
    const me = this;
    var importTransaction: ImportTransaction,
        importTransactionsToSave: ImportTransaction[] = [],
        amountIndex,
        transactionTypeIndex,
        conceptIndex,
        costCentreIndex,
        bankAccountIndex,
        companyIndex,
        commentsIndex,
        dateIndex;

    me.fieldNames = data[0];
    amountIndex = me.fieldNames.indexOf('Amount');
    transactionTypeIndex = me.fieldNames.indexOf('Type');
    conceptIndex = me.fieldNames.indexOf('Concept');
    costCentreIndex = me.fieldNames.indexOf('CostCentre');
    bankAccountIndex = me.fieldNames.indexOf('BankAccount');
    companyIndex = me.fieldNames.indexOf('Company');
    commentsIndex = me.fieldNames.indexOf('Comments');
    dateIndex = me.fieldNames.indexOf('Date');

    for (var f=1; f<data.length; f++)
    {
      var rowData = data[f];

      importTransaction = new ImportTransaction;
      importTransaction.amount = rowData[amountIndex];
      importTransaction.transactionType = rowData[transactionTypeIndex];
      importTransaction.conceptName = rowData[conceptIndex];
      importTransaction.costCentreName = rowData[costCentreIndex];
      importTransaction.accountName = rowData[bankAccountIndex];
      importTransaction.company = rowData[companyIndex];
      importTransaction.comments = rowData[commentsIndex];
      importTransaction.date = me.excelDateToJSDate(rowData[dateIndex]);

      importTransactionsToSave.push(importTransaction);
    }

    return me.service.importTransactions(importTransactionsToSave);
  }

  excelDateToJSDate(value) {
    var utc_days  = Math.floor(value - 25569);
    var utc_value = utc_days * 86400;
    var date_info = new Date(utc_value * 1000);

    var fractional_day = value - Math.floor(value) + 0.0000001;

    var total_seconds = Math.floor(86400 * fractional_day);

    var seconds = total_seconds % 60;

    total_seconds -= seconds;

    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(date_info.getFullYear(), date_info.getMonth()+1, date_info.getDate(), hours, minutes, seconds);
 }
};