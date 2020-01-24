import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { Observable } from 'rxjs';
import { Account } from 'src/app/models/account';

export class ImportAccountsHelper {

  fieldNames: string[];

  constructor(
    private accountsService: AccountsService
  ) { }

  import(data): Observable<Account[]> {
    const me = this;
    var account: Account,
        accountsToSave: Account[] = [],
        userNameIndex,
        nameIndex,
        descriptionIndex,
        activeIndex,
        ibanIndex,
        commentsIndex,
        companyIndex,
        amountIndex

    me.fieldNames = data[0];
    userNameIndex = me.fieldNames.indexOf('UserName');
    nameIndex = me.fieldNames.indexOf('Name');
    descriptionIndex = me.fieldNames.indexOf('Description');
    activeIndex = me.fieldNames.indexOf('Active');
    ibanIndex = me.fieldNames.indexOf('Iban');
    commentsIndex = me.fieldNames.indexOf('Comments');
    companyIndex = me.fieldNames.indexOf('Company');
    amountIndex = me.fieldNames.indexOf('Amount');

    for (var f=1; f<data.length; f++)
    {
      var rowData = data[f];

      account = new Account;
      account.username = rowData[userNameIndex];
      account.name = rowData[nameIndex];
      account.description = rowData[descriptionIndex];
      account.active = rowData[activeIndex].trim() === 'true' ? true : false;
      account.iban = rowData[ibanIndex];
      account.comments = rowData[commentsIndex];
      account.updated = new Date();
      account.company = rowData[companyIndex];
      account.amount = rowData[amountIndex];

      accountsToSave.push(account);
    }

    return me.accountsService.createAccounts(accountsToSave);
  }
};
