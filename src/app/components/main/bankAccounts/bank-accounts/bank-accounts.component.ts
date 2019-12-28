import { Component } from '@angular/core';
import { BankAccountsService } from 'src/app/services/bankAccounts/bank-accounts.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent {

  bankAccounts: any[];
  usedCompany: string;

  constructor(
    private bankAccountsService: BankAccountsService,
    private toastr: ToastrService,
    private globals: GlobalsService
  ) {
    const me = this;
    me.usedCompany = globals.getCompany();
    me.getBankAccountsForCompany(me.usedCompany);

  }

  private getBankAccountsForCompany(company: string): void {
    const me = this;

    me.globals.maskScreen();
    me.bankAccountsService.getBankAccountsForCompany(company)
      .subscribe(bankAccounts => {
        me.bankAccounts = bankAccounts;
        me.globals.unMaskScreen();
      },
      error => {
        me.globals.unMaskScreen();
        me.toastr.error(error.message);
      });
  }
}
