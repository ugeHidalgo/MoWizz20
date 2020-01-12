import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
//import { slideInDownAnimation } from '../../../../globals/animations';
import { GlobalsService } from 'src/app/globals/globals.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { Transaction } from 'src/app/models/transaction';
import { CostCentre } from 'src/app/models/costCentre';
import { Concept } from 'src/app/models/concept';
import { Account } from 'src/app/models/account';
import { TransactionTypes, TransactionType } from 'src/app/models/transactionType';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CostCentresService } from 'src/app/services/costCentres/cost-centres.service';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { Observable, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
  //animations: [ slideInDownAnimation ]
})
export class TransactionDetailComponent {

  /* @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'relative'; */

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
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    const me = this;
  }

  ngOnInit() {
    const me = this,
          id = me.route.snapshot.paramMap.get('id');

    me.globals.maskScreen();
    me.createForm();
    me.setTitle(id);
    me.company = me.globals.getCompany();
    me.loadInitialData(id).subscribe(([accounts, costCentres, transaction]) => {
      me.accounts = accounts;
      me.costCentres = costCentres;
      if (transaction) {
        me.transaction = transaction;
      }
      me.globals.unMaskScreen();
    },
    error => {
      me.globals.unMaskScreen();
      me.toastr.error(error.message);
    });

  }

  loadInitialData(id): Observable<any> {
    const me = this;
    let transaction,
        accounts = me.accountService.getActiveAccounts(me.company),
        costCentres = me.costCentreService.getActiveCostCentres(me.company);

    if (id === '-1') {
      me.transaction = me.createNewTransaction();
      return forkJoin([accounts, costCentres]);
    }

    transaction = me.transactionsService.getTransactionById(me.company, id)
    return forkJoin([accounts, costCentres, transaction]);
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

  onClickSaveButton() {
    this.location.back();
  }

  onClickUnDoButton() {
    this.location.back();
  }

/*   getTransactionById(id: string): void {
    const me = this;

    me.transactionsService.getTransactionById(me.company, id)
      .subscribe( transaction => {
          me.transaction = transaction;
          //me.fillEmptyValues();
      });
  } */

  setTitle(id: string): void {
    const me = this;

    if (id === '-1'){
      me.title ='Nuevo movimiento';
    } else {
      me.title ='Editar movimiento';
    }
  }

/*   fillEmptyValues(): void {
    const me = this;

    if (!me.transaction.costCentre) {
      me.transaction.costCentre = new CostCentre();
    }
  } */

  // FormModel methods
  createForm() {
    const me = this;

    me.validatingForm = me.fb.group({
      date: '',
      transactionType: '',
      concept: '',
      costCentre: '',
      account: '',
      comments: '',
      amount: ''
    });
  }

}
