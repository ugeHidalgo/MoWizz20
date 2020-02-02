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
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})

export class TransactionDetailComponent implements OnInit {
  transactionId: string;
  title: string;
  userName: string;
  company: string;
  transaction: Transaction;
  validatingForm: FormGroup;
  transactionTypes: TransactionType[] = TransactionTypes;
  concepts: Concept[];
  costCentres: CostCentre[];
  accounts: Account[];
  user: User;
  validation_messages = {
    'date': [
      { type: 'required', message: 'El campo fecha es obligatorio.'}
    ],
    'transactionType': [
      { type: 'required', message: 'El tipo de movimiento es obligatoria.'},
    ],
    'account': [
      { type: 'required', message: 'La cuenta de cargo es obligatoria.'},
    ],
    'costCentre': [
      { type: 'required', message: 'El centro de gasto es obligatoria.'}
    ],
    'concept': [
      { type: 'required', message: 'El concepto es obligatorio.'}
    ],
    'comments': [
      { type: 'maxlength', message: 'El numero máximo de caracteres en el campo comentarios es de 100.'}
    ],
    'amount': [
      { type: 'max', message: 'El valor máximo permitido es 999999.'},
      { type: 'min', message: 'El valor mínimo permitido es -999999.'}
    ]

  }

  constructor(
    private location : Location,
    private route : ActivatedRoute,
    protected globals: GlobalsService,
    private transactionsService: TransactionsService,
    private costCentreService: CostCentresService,
    private accountService: AccountsService,
    private conceptsService: ConceptsService,
    private usersService: UsersService,
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
    me.userName = me.globals.userNameLogged;
    me.company = me.globals.getCompany();
    me.loadInitialData().subscribe(([accounts, costCentres, user, transaction]) => {
      me.accounts = accounts;
      me.costCentres = costCentres;
      me.user = user;
      if (me.transactionId == '-1') {
        me.transaction = me.createNewTransaction();;
      } else {
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
        costCentres = me.costCentreService.getActiveCostCentres(me.company),
        user = me.usersService.getUser(me.userName);

    if (me.transactionId === '-1') {
      return forkJoin([accounts, costCentres, user]);
    }

    transaction = me.transactionsService.getTransactionById(me.company, me.transactionId)
    return forkJoin([accounts, costCentres, user, transaction]);
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
    const me = this;
    let transaction = new Transaction,
        defaultTransactionType = me.user.transactionType ? me.user.transactionType : '2',
        defaultCostCentre = me.user.costCentre ? me.user.costCentre : new CostCentre,
        defaultAccount = me.user.account ? me.user.account : new Account;

    transaction.date = new Date;
    transaction.concept = new Concept;
    transaction.account = defaultAccount;
    transaction.costCentre = defaultCostCentre;
    transaction.transactionType = Number(defaultTransactionType);
    transaction.company = this.company;
    transaction.comments = '';
    transaction.amount = 0;

    return transaction;
  }

  onClickGoBackButton() {
    this.location.back();
  }

  onClickSaveButton(): void {
    const me = this;

    if (me.validatingForm.invalid) {
      me.toastr.error('Hay errores en pantalla. Corríjalos antes de salvar.');
      return;
    }

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
      date: new FormControl('', [Validators.required]),
      transactionType: new FormControl('', [Validators.required]),
      concept: new FormControl('', [Validators.required]),
      costCentre: new FormControl('', [Validators.required]),
      account: new FormControl('', [Validators.required]),
      comments: new FormControl('', [Validators.maxLength(100)]),
      amount: new FormControl('', { validators: Validators.compose([Validators.max(99999), Validators.min(-999999)])}),
    },
    { updateOn: 'blur'});
  }

  rebuildForm() {
    const me = this,
          accountName = me.transaction.account && me.transaction.account.name ? me.transaction.account.name : '',
          costCentreName = me.transaction.costCentre && me.transaction.costCentre.name ? me.transaction.costCentre.name : '',
          conceptName = me.transaction.concept && me.transaction.concept.name ? me.transaction.concept.name : '';

    me.validatingForm.setValue({
      date: me.transaction.date,
      transactionType: me.transaction.transactionType,
      account: accountName,
      costCentre: costCentreName,
      concept: conceptName,
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

  isInvalidField(fieldName: string, validationType: string): boolean {
    const me = this;

    if (!me.validatingForm.get(fieldName)) {
      return false;
    }

    return me.validatingForm.get(fieldName).hasError(validationType);
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
