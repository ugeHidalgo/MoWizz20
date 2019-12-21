import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { BankAccount } from 'src/app/models/bankAccount';
import { BankAccountsService } from 'src/app/services/bankAccounts/bank-accounts.service';
import { GlobalsService } from 'src/app/globals/globals.service';

type AOA = any[][];

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent {

  data: AOA = [ [1, 2], [3, 4] ];
  fieldNames: string[];
	wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
	fileName: string = 'SheetJS.xlsx';

  constructor(
    private bankAccountsService: BankAccountsService
  ) { }

  onFileChange(evt: any) {
		/* wire up file reader */
		const target: DataTransfer = <DataTransfer>(evt.target);
		if (target.files.length !== 1) throw new Error('Cannot use multiple files');
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			/* grab first sheet */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			/* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
      this.fieldNames = this.data[0];
		};
		reader.readAsBinaryString(target.files[0]);
	}

	import(): void {
    const me = this;
    var bankAccount = new BankAccount,
        bankAccountsToSave: BankAccount[] = [],
        userNameIndex = this.fieldNames.indexOf('UserName'),
        nameIndex = this.fieldNames.indexOf('Name'),
        descriptionIndex = this.fieldNames.indexOf('Description'),
        activeIndex = this.fieldNames.indexOf('Active'),
        ibanIndex = this.fieldNames.indexOf('Iban'),
        commentsIndex = this.fieldNames.indexOf('Comments');



    for (var f=1; f<this.data.length; f++)
    {
      var rowData = me.data[f];

      bankAccount.username = rowData[userNameIndex];
      bankAccount.name = rowData[nameIndex];
      bankAccount.description = rowData[descriptionIndex];
      bankAccount.active = rowData[activeIndex] === 'true' ? true : false;
      bankAccount.iban = rowData[ibanIndex];
      bankAccount.comments = rowData[commentsIndex];
      bankAccount.updated = new Date();

      bankAccountsToSave.push(bankAccount);

    }
    me.bankAccountsService.createBankAccounts(bankAccountsToSave[0])
      .subscribe(bankAccount => {
        console.log('New Bank account created.')
      });
  }
}
