import { BankAccountsService } from 'src/app/services/bankAccounts/bank-accounts.service';
import { BankAccount } from 'src/app/models/bankAccount';
import { Observable } from 'rxjs';

export class ImportBankAccountsHelper {

  fieldNames: string[];

  constructor(
    private bankAccountsService: BankAccountsService
  ) { }

  import(data): Observable<BankAccount[]> {
    const me = this;
    var bankAccount: BankAccount,
        bankAccountsToSave: BankAccount[] = [],
        userNameIndex,
        nameIndex,
        descriptionIndex,
        activeIndex,
        ibanIndex,
        commentsIndex;

    me.fieldNames = data[0];
    userNameIndex = me.fieldNames.indexOf('UserName');
    nameIndex = me.fieldNames.indexOf('Name');
    descriptionIndex = me.fieldNames.indexOf('Description');
    activeIndex = me.fieldNames.indexOf('Active');
    ibanIndex = me.fieldNames.indexOf('Iban');
    commentsIndex = me.fieldNames.indexOf('Comments');

    for (var f=1; f<data.length; f++)
    {
      var rowData = data[f];

      bankAccount = new BankAccount;
      bankAccount.username = rowData[userNameIndex];
      bankAccount.name = rowData[nameIndex];
      bankAccount.description = rowData[descriptionIndex];
      bankAccount.active = rowData[activeIndex] === 'true' ? true : false;
      bankAccount.iban = rowData[ibanIndex];
      bankAccount.comments = rowData[commentsIndex];
      bankAccount.updated = new Date();

      bankAccountsToSave.push(bankAccount);
    }

    return me.bankAccountsService.createBankAccounts(bankAccountsToSave);
  }
};
