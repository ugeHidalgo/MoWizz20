import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImportBankAccountsHelper } from './helpers/import-bankAccounts.helper';
import { BankAccountsService } from 'src/app/services/bankAccounts/bank-accounts.service';

type AOA = any[][];
export interface DataEntity {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent {

  data: AOA;
  importBankAccountsHelper: ImportBankAccountsHelper;
	wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  dataEntities: DataEntity[] = [
    {value: 'banksAccount', viewValue: 'Cuentas bancarias'},
    {value: 'concept', viewValue: 'Conceptos'},
    {value: 'costCenters', viewValue: 'Centros de gasto'},
    {value: 'transactions', viewValue: 'Movimientos'},
    {value: 'transactionTypes', viewValue: 'Tipos de movimientos'},
    {value: 'users', viewValue: 'Usuarios'}
  ];

  constructor(
    private bankAccountsService: BankAccountsService
  ) {
    this.importBankAccountsHelper = new ImportBankAccountsHelper(bankAccountsService);
  }

  onFileChange(evt: any) {
		/* wire up file reader */
    const reader: FileReader = new FileReader(),
          target: DataTransfer = <DataTransfer>(evt.target);

		if (target.files.length !== 1) throw new Error('Cannot use multiple files');
		reader.onload = (e: any) => {
      const bstr = e.target.result,
            wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'}), // read workbook
            wsname: string = wb.SheetNames[0], // grab first sheet
            ws: XLSX.WorkSheet = wb.Sheets[wsname];

			// save data
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1}));
		};
		reader.readAsBinaryString(target.files[0]);
	}

	import(): void {
    const me = this;

    me.importBankAccountsHelper.import(me.data);
  }
}
