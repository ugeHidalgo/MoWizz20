import { Component } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {
  transactions: any[];
  displayedColumns: string[];
  usedCompany: string;

  constructor(
    private transactionsService: TransactionsService,
    private toastr: ToastrService,
    private globals: GlobalsService
  ) {
    const me = this;
    me.displayedColumns = ['date','amount','comments'];
    me.usedCompany = globals.getCompany();
    me.getTransactionsForCompany(me.usedCompany);
  }

  private getTransactionsForCompany(company: string): void {
    const me = this;

    me.globals.maskScreen();
    me.transactionsService.getTransactionsForCompany(company)
      .subscribe(transactions => {
        me.transactions = transactions;
        me.globals.unMaskScreen();
      },
      error => {
        me.globals.unMaskScreen();
        me.toastr.error(error.message);
      });
  }
}
