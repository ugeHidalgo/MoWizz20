import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImportBankAccountsHelper } from './helpers/import-bankAccounts.helper';
import { BankAccountsService } from 'src/app/services/bankAccounts/bank-accounts.service';
import { ToastrService } from 'ngx-toastr';

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
  loading: boolean = false;
  selectedEntity : string;
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
    private toastr: ToastrService,
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

    me.loading = true;
    if (!me.selectedEntity) return;
    switch (me.selectedEntity) {
      case "banksAccount":
          me.importBankAccountsHelper.import(me.data)
            .subscribe(savedBankAccounts => {
              me.toastr.success(`A total of ${savedBankAccounts.length} bank accounts were successfully created.`);
            },
            error => {
              me.toastr.error(error.message);
              me.loading = false;
            });
        break;

      case "concept":
          //me.importConceptsHelper.import(me.data);
        break;

      case "costCenters":
          //me.importCostCentersHelper.import(me.data);
        break;

      case "transactions":
          //me.importTransactionsHelper.import(me.data);
        break;

      case "transactionTypes":
          //me.importTransactionTypesHelper.import(me.data);
        break;

      case "users":
          //me.importUsersHelper.import(me.data);
        break;
    }

  }
}
