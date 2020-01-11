import { Component } from '@angular/core';
import { AccountsService } from 'src/app/services/accounts/accounts.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {

  accounts: any[];
  usedCompany: string;

  constructor(
    private accountsService: AccountsService,
    private toastr: ToastrService,
    private globals: GlobalsService
  ) {
    const me = this;
    me.usedCompany = globals.getCompany();
    me.getAccountsForCompany(me.usedCompany);

  }

  private getAccountsForCompany(company: string): void {
    const me = this;

    me.globals.maskScreen();
    me.accountsService.getAccountsForCompany(company)
      .subscribe(accounts => {
        me.accounts = accounts;
        me.globals.unMaskScreen();
      },
      error => {
        me.globals.unMaskScreen();
        me.toastr.error(error.message);
      });
  }
}
