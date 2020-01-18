import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GlobalsService } from 'src/app/globals/globals.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { Transaction } from 'src/app/models/transaction';
import { CostCentre } from 'src/app/models/costCentre';
import { Concept } from 'src/app/models/concept';
import { Account } from 'src/app/models/account';
import { TransactionTypes, TransactionType } from 'src/app/models/transactionType';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CostCentresService } from 'src/app/services/costCentres/cost-centres.service';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { Observable, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent {
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
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    const me = this;
  }

  ngOnInit() {
    const me = this;

    me.globals.maskScreen();
    me.transactionId = me.route.snapshot.paramMap.get('id');
    me.createForm();
    me.setScreenTitle();
    me.company = me.globals.getCompany();
    me.loadInitialData().subscribe(([accounts, costCentres, transaction]) => {
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

  setScreenTitle(): void {
    const me = this;

    if (me.transactionId === '-1'){
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
      date: ['', Validators.required ],
      transactionType: ['', Validators.required ],
      concept: ['', Validators.required ],
      costCentre: ['', Validators.required ],
      account: ['', Validators.required ],
      comments: '',
      amount: ['', Validators.required ]
    });
  }

}
