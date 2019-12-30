import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { ImportBankAccountsHelper } from './helpers/import-bankAccounts.helper';
import { BankAccountsService } from 'src/app/services/bankAccounts/bank-accounts.service';
import { ToastrService } from 'ngx-toastr';
import { ImportCompaniesHelper } from './helpers/import-companies.helper';
import { CompaniesService } from 'src/app/services/companies/companies.service';
import { GlobalsService } from 'src/app/globals/globals.service';
import { ConceptsService } from 'src/app/services/concepts/concepts.service';
import { ImportConceptsHelper } from './helpers/import-concepts.helper';
import { ImportCostCentresHelper } from './helpers/import-costCentres.helper';
import { CostCentresService } from 'src/app/services/costCentres/cost-centres.service';

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
  importBankAccountsHelper: ImportBankAccountsHelper;
  importCompaniesHelper: ImportCompaniesHelper;
  importConceptsHelper: ImportConceptsHelper;
  importCostCentresHelper: ImportCostCentresHelper;
	wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  dataEntities: DataEntity[] = [
    {value: 'banksAccount', viewValue: 'Cuentas bancarias'},
    {value: 'concept', viewValue: 'Conceptos'},
    {value: 'costCenters', viewValue: 'Centros de gasto'},
    {value: 'transactions', viewValue: 'Movimientos'},
    {value: 'companies', viewValue: 'Definiciones de libros contables'}
  ];

  constructor(
    private toastr: ToastrService,
    private bankAccountsService: BankAccountsService,
    private companiesService: CompaniesService,
    private conceptsService: ConceptsService,
    private costCentresService: CostCentresService,
    private globals: GlobalsService
  ) {
    var me = this;

    me.importBankAccountsHelper = new ImportBankAccountsHelper(bankAccountsService);
    me.importCompaniesHelper = new ImportCompaniesHelper(companiesService);
    me.importConceptsHelper = new ImportConceptsHelper(conceptsService);
    me.importCostCentresHelper = new ImportCostCentresHelper(costCentresService);

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
      case "banksAccount":
          me.importBankAccountsHelper.import(me.data)
            .subscribe(savedBankAccounts => {
              me.globals.unMaskScreen();
              me.toastr.success(`A total of ${savedBankAccounts.length} bank accounts were successfully created.`);
            },
            error => {
              me.globals.unMaskScreen();
              me.toastr.error(error.message);
            });
        break;

      case "concept":
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
          //me.importTransactionsHelper.import(me.data);
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
