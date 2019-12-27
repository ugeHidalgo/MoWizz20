import { Component } from '@angular/core';
import { BankAccountsService } from 'src/app/services/bankAccounts/bank-accounts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent {

  bankAccounts: any[];
  loading: boolean = false;

  constructor(
    private bankAccountsService: BankAccountsService,
    private toastr: ToastrService
  ) {
    const me = this;

    me.getBankAccounts();

  }

  private getBankAccounts(): void {
    const me = this;

    me.loading = true
    me.bankAccountsService.getBankAccounts()
      .subscribe(bankAccounts => {
        me.bankAccounts = bankAccounts;
        me.loading = false;
      },
      error => {
        me.loading = false;
        me.toastr.error(error.message);
      });
  }
}
