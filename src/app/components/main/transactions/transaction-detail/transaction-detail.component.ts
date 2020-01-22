import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Location, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalsService } from 'src/app/globals/globals.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { Transaction } from 'src/app/models/transaction';
import { CostCentre } from 'src/app/models/costCentre';
import { Concept } from 'src/app/models/concept';
import { Account } from 'src/app/models/account';
import { TransactionTypes, TransactionType } from 'src/app/models/transactionType';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CostCentresService } from 'src/app/services/costCentres/cost-centres.service';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { Observable, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ConceptsService } from 'src/app/services/concepts/concepts.service';
import { EuroCurrencyPipe } from 'src/app/pipes/EuroCurrencyPipe';


@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})

export class TransactionDetailComponent implements OnInit {
  transactionId: string;
  title: string;
  company: string;
  transaction: Transaction;
  validatingForm: FormGroup;
  transactionTypes: TransactionType[] = TransactionTypes;
  concepts: Concept[];
  costCentres: CostCentre[];
  accounts: Account[];

  constructor(
    private location : Location,
    private route : ActivatedRoute,
    protected globals: GlobalsService,
    private transactionsService: TransactionsService,
    private costCentreService: CostCentresService,
    private accountService: AccountsService,
    private conceptsService: ConceptsService,
    private toastr: ToastrService
  ) {
    const me = this;
    me.globals.maskScreen();
    me.createForm();
  }

  ngOnInit() {
    const me = this;

    me.transactionId = me.route.snapshot.paramMap.get('id');
    me.setScreenTitle();
    me.company = me.globals.getCompany();
    me.loadInitialData().subscribe(([accounts, costCentres, transaction]) => {
      me.accounts = accounts;
      me.costCentres = costCentres;
      if (transaction) {
        me.transaction = transaction;
      }
      me.getActiveConceptsByType(me.transaction.transactionType);
      me.rebuildForm();
      me.globals.unMaskScreen();
    },
    error => {
      me.globals.unMaskScreen();
      me.toastr.error(error.message);
    });
  }

  loadInitialData(): Observable<any> {
    const me = this;
    let transaction,
        accounts = me.accountService.getActiveAccounts(me.company),
        costCentres = me.costCentreService.getActiveCostCentres(me.company);

    if (me.transactionId === '-1') {
      me.transaction = me.createNewTransaction();
      return forkJoin([accounts, costCentres]);
    }

    transaction = me.transactionsService.getTransactionById(me.company, me.transactionId)
    return forkJoin([accounts, costCentres, transaction]);
  }

  setScreenTitle(): void {
    const me = this;

    if (me.transactionId === '-1'){
      me.title ='Nuevo movimiento';
    } else {
      me.title ='Editar movimiento';
    }
  }

  createNewTransaction(): Transaction {
    let transaction = new Transaction;

    transaction.date = new Date;
    transaction.concept = new Concept;
    transaction.account = new Account;
    transaction.costCentre = new CostCentre;
    transaction.transactionType = 2;
    transaction.company = this.company;
    transaction.amount = 0;

    return transaction;
  }

  onClickGoBackButton() {
    this.location.back();
  }

  onClickSaveButton(): void {
    const me = this;

    me.globals.maskScreen();
    me.transaction = me.getFormData();
    me.transactionsService.createOrUpdateTransaction(me.transaction)
      .subscribe( (updatedTransaction) => {
          if (updatedTransaction) {
            me.globals.unMaskScreen();
            me.toastr.success('Movimiento guardado correctamente.');
          } else {
            me.globals.unMaskScreen();
            me.toastr.error('No se puedo salvar el movimiento. Inténtelo de nuevo.');
          }
        }
      );
    me.rebuildForm();
  }

  onClickUndoButton() {
    this.rebuildForm();
  }

  onTransactionTypeSelected(): void {
    const me = this,
          formModel = me.validatingForm.value;

    me.getActiveConceptsByType(formModel.transactionType);
    me.transaction.concept = new Concept;
    me.validatingForm.patchValue({concept: me.transaction.concept});
  }

  onAmountChanged(): void {
    var me = this,
        formModel = me.validatingForm.value,
        newAmount = me.getAmountFromForm(formModel);

    if(newAmount<0){
      document.getElementById("my-amount-field").style.color="red";
    } else {
      document.getElementById("my-amount-field").style.color="black";
    }
  }

  // FormModel methods
  createForm() {
    const me = this;

    me.validatingForm = new FormGroup({
      date: new FormControl('',[Validators.required]),
      transactionType: new FormControl('',[Validators.required]),
      concept: new FormControl('',[Validators.required]),
      costCentre: new FormControl('',[Validators.required]),
      account: new FormControl('',[Validators.required]),
      comments: new FormControl('',[]),
      amount: new FormControl('',[Validators.required]),
    });
  }

  rebuildForm() {
    const me = this;

    me.validatingForm.setValue({
      date: me.transaction.date,
      transactionType: me.transaction.transactionType,
      account: me.transaction.account.name,
      costCentre: me.transaction.costCentre.name,
      concept: me.transaction.concept.name,
      comments: me.transaction.comments,
      amount: me.transaction.amount
    });
  }

/*   rebuildPipedData() {
    this.rebuildEuroCurrencyPipeData();
  }

  rebuildEuroCurrencyPipeData() {
    const me = this;
    var actualAmount = me.validatingForm.get('amount').value,
        formattedAmount = me.euroCurrencyPipe(actualAmount);

    me.validatingForm.patchValue({amount: formattedAmount});
  } */

  getFormData(): Transaction {
    const me = this,
          formModel = me.validatingForm.value,
          newTransaction: Transaction = me.transaction;

    newTransaction.date = formModel.date;
    newTransaction.transactionType = formModel.transactionType;
    newTransaction.concept = me.getConceptByName(formModel.concept);
    newTransaction.costCentre = me.getCostCentreByName(formModel.costCentre);
    newTransaction.account = me.getAccountByName(formModel.account);
    newTransaction.comments = formModel.comments;
    newTransaction.amount = me.getAmountFromForm(formModel);

    return newTransaction;
  }

  getAccountByName(name): Account {
    return this.accounts.find( function(x) { return x.name === name; });
  }

  getCostCentreByName(name): CostCentre {
    return this.costCentres.find( function(x) { return x.name === name; });
  }

  getConceptByName(name): Concept {
    return this.concepts.find( function(x) { return x.name === name; });
  }

  getActiveConceptsByType(transactionType: number): void {
    const me = this;

    me.globals.maskScreen();
    me.conceptsService.getActiveConceptsByType(me.company, transactionType)
    .subscribe( concepts => {
        me.concepts = concepts;
        me.globals.unMaskScreen();
    });
  }

  getAmountFromForm(formModel: any): number {
    let amount = formModel.amount;
    if (formModel.transactionType === 2) {//Expense
      if (amount>=0) {
        amount = amount * -1;
      }
    }
    return amount;
  }
/*   euroCurrencyPipe(value) {
    const pipe = new EuroCurrencyPipe();

    return pipe.transform(value);
  }

  decimalFormatter(value) {
    const me = this,
          valueWithoutCurrency = value.substring(0, value.indexOf(" ")),
          decimalPipe = new DecimalPipe(navigator.language);

    return Number(decimalPipe.transform(valueWithoutCurrency));
  } */
}
