import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImportAccountsHelper } from './helpers/import-accounts.helper';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { ImportCompaniesHelper } from './helpers/import-companies.helper';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { GlobalsService } from 'src/app/globals/globals.service';
import { ConceptsService } from 'src/app/services/concepts/concepts.service';
import { ImportConceptsHelper } from './helpers/import-concepts.helper';
import { ImportCostCentresHelper } from './helpers/import-costCentres.helper';
import { CostCentresService } from 'src/app/services/costCentres/cost-centres.service';
import { ImportTransactionsHelper } from './helpers/import-transactions.helper';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';

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
  selectedEntity : string;
  importAccountsHelper: ImportAccountsHelper;
  importCompaniesHelper: ImportCompaniesHelper;
  importConceptsHelper: ImportConceptsHelper;
  importTransactionsHelper: ImportTransactionsHelper;
  importCostCentresHelper: ImportCostCentresHelper;
	wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  dataEntities: DataEntity[] = [
    {value: 'accounts', viewValue: 'Cuentas de cargo'},
    {value: 'concepts', viewValue: 'Conceptos'},
    {value: 'costCenters', viewValue: 'Centros de gasto'},
    {value: 'transactions', viewValue: 'Movimientos'},
    {value: 'companies', viewValue: 'Definiciones de libros contables'}
  ];

  constructor(
    private toastr: ToastrService,
    private accountsService: AccountsService,
    private companiesService: CompaniesService,
    private conceptsService: ConceptsService,
    private costCentresService: CostCentresService,
    private transactionsService: TransactionsService,
    private globals: GlobalsService
  ) {
    var me = this;

    me.importAccountsHelper = new ImportAccountsHelper(accountsService);
    me.importCompaniesHelper = new ImportCompaniesHelper(companiesService);
    me.importConceptsHelper = new ImportConceptsHelper(conceptsService);
    me.importCostCentresHelper = new ImportCostCentresHelper(costCentresService);
    me.importTransactionsHelper = new ImportTransactionsHelper(transactionsService);
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

    me.globals.maskScreen();
    if (!me.selectedEntity) return;
    switch (me.selectedEntity) {
      case "accounts":
          me.importAccountsHelper.import(me.data)
            .subscribe(savedAccounts => {
              me.globals.unMaskScreen();
              me.toastr.success(`A total of ${savedAccounts.length} accounts were successfully created.`);
            },
            error => {
              me.globals.unMaskScreen();
              me.toastr.error(error.message);
            });
        break;

      case "concepts":
        me.importConceptsHelper.import(me.data)
        .subscribe(savedConcepts => {
          me.globals.unMaskScreen();
          me.toastr.success(`A total of ${savedConcepts.length} concepts were successfully created.`);
        },
        error => {
          me.globals.unMaskScreen();
          me.toastr.error(error.message);
        });
        break;

      case "costCenters":
        me.importCostCentresHelper.import(me.data)
        .subscribe(savedCostCentres => {
          me.globals.unMaskScreen();
          me.toastr.success(`A total of ${savedCostCentres.length} cost centres were successfully created.`);
        },
        error => {
          me.globals.unMaskScreen();
          me.toastr.error(error.message);
        });
        break;

      case "transactions":
        me.importTransactionsHelper.import(me.data)
        .subscribe(savedTransactions => {
          me.globals.unMaskScreen();
          me.toastr.success(`A total of ${savedTransactions.length} transactions were successfully created.`);
        },
        error => {
          me.globals.unMaskScreen();
          me.toastr.error(error.message);
        });
        break;

      case "companies":
          me.importCompaniesHelper.import(me.data)
          .subscribe(savedCompanies => {
            me.globals.unMaskScreen();
            me.toastr.success(`A total of ${savedCompanies.length} companies were successfully created.`);
          },
          error => {
            me.globals.unMaskScreen();
            me.toastr.error(error.message);
          });
        break;

      default:
        break;
    }

  }
}
