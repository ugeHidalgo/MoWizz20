import { Component, ViewChild } from '@angular/core';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Account } from 'src/app/models/account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  selectedRowId: string = '-1';
  accounts: any[];
  displayedColumns: string[];
  displayedFooterColumns: string[];
  usedCompany: string;
  dataSource: MatTableDataSource<Account>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private accountsService: AccountsService,
    private toastr: ToastrService,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.displayedColumns = ['name','amount', 'description', 'active'];
    me.displayedFooterColumns = ['name', 'amount'];
    me.usedCompany = globals.getCompany();
    me.getAccountsForCompany(me.usedCompany);
  }

  private getAccountsForCompany(company: string): void {
    const me = this;

    me.globals.maskScreen();
    me.accountsService.getAccounts(company)
      .subscribe(accounts => {
        me.accounts = accounts;
        me.dataSource = new MatTableDataSource<Account>(accounts);
        me.dataSource.paginator = me.paginator;
        me.dataSource.sort = me.sort;
        me.globals.unMaskScreen();
      },
      error => {
        me.globals.unMaskScreen();
        me.toastr.error(error.message);
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickAddButton() {
    this.toastr.warning('To be implemented.');
    /* const pathToAccountDetail = `/accountdetail/-1`;

    this.router.navigate([pathToAccountDetail]); */
  }

  onClickEditButton() {
    this.toastr.warning('To be implemented.');
    /* const pathToAccountDetail = `/accountdetail/` + this.selectedRowId;

    this.router.navigate([pathToAccountDetail]); */
  }

  onClickRemoveButton() {
    this.toastr.warning('To be implemented.');
  }

  selectRow(row) {
    this.selectedRowId = row.id;
  }

  getTotalAmount() {
    if (!this.accounts) return 0;
    return this.accounts.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }
}
