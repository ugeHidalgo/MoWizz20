import { Component, ViewChild } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';
import { TransactionType, TransactionTypes } from 'src/app/models/transactionType';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Transaction } from 'src/app/models/transaction';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  transactions: any[];
  transactionTypes: TransactionType[] = TransactionTypes;
  displayedColumns: string[];
  usedCompany: string;
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private transactionsService: TransactionsService,
    private toastr: ToastrService,
    private globals: GlobalsService
  ) {
    const me = this;
    me.displayedColumns = ['date', 'type', 'amount', 'account', 'concept', 'comments'];
    me.usedCompany = globals.getCompany();
    me.getTransactionsForCompany(me.usedCompany);
  }

  private getTransactionsForCompany(company: string): void {
    const me = this;

    me.globals.maskScreen();
    me.transactionsService.getTransactionsForCompany(company)
      .subscribe(transactions => {
        me.globals.unMaskScreen();
        me.dataSource = new MatTableDataSource<Transaction>(transactions);
        me.dataSource.paginator = me.paginator;
        me.dataSource.sort = me.sort;
      },
      error => {
        me.globals.unMaskScreen();
        me.toastr.error(error.message);
      });
  }
}
