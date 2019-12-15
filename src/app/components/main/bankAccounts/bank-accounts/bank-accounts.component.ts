import { Component, OnInit } from '@angular/core';
import { BankAccountsService } from 'src/app/services/bankAccounts/bank-accounts.service';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent {

  bankAccounts: any[];

  constructor(
    private bankAccountsService: BankAccountsService
  ) {
    const me = this;

    me.getBankAccounts();

  }

  private getBankAccounts(): void {
    const me = this;

    me.bankAccountsService.getBankAccounts()
      .subscribe(bankAccounts => {
        me.bankAccounts = bankAccounts;
      });
  }
}
