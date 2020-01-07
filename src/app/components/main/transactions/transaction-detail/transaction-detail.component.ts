import { Component, HostBinding } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { slideInDownAnimation } from '../../../../globals/animations';
import { GlobalsService } from 'src/app/globals/globals.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { Transaction } from 'src/app/models/transaction';


@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
  animations: [ slideInDownAnimation ]
})
export class TransactionDetailComponent {

  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.position') position = 'relative';

  title: string;
  transaction: Transaction;

  constructor(
    private location : Location,
    private route : ActivatedRoute,
    protected globals: GlobalsService,
    private transactionsService: TransactionsService
  ) { }

  ngOnInit() {
    const me = this,
          id = me.route.snapshot.paramMap.get('id');

    if ( id==='-1' ){
      me.title ="Nuevo movimiento";
    } else {
      me.getTransactionById(id);
    }
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

  getTransactionById(id: string): void {
    const me = this,
          company = me.globals.getCompany();

    me.transactionsService.getTransactionById(company, id)
      .subscribe( transaction => {
          me.transaction = transaction;
          me.title ="Movimiento: " + me.transaction.comments;
      });
  }

}
