import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BankAccount } from '../../models/bankAccount';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { GlobalsService } from 'src/app/globals/globals.service';
import { Router } from '@angular/router';
import { OperationsHelper } from '../operations.helper';


@Injectable({
  providedIn: 'root'
})
export class BankAccountsService {
  private bankAccountsUrl;
  private operationHelper;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.bankAccountsUrl  = globals.server + 'api/bankaccounts';
    me.operationHelper = new OperationsHelper(globals,router);
  }

  /**.*/
  getBankAccounts(): Observable<BankAccount[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return me.http.get<BankAccount[]>(me.bankAccountsUrl, httpOptions)
              .pipe(
                tap(any => console.log('Bank accounts fetched successfully.')),
                catchError(me.operationHelper.handleError('getBankAccounts', []))
              );
  }

  /**.*/
  createBankAccounts(bankAccounts: BankAccount[]): Observable<BankAccount[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return this.http.post<BankAccount[]>(me.bankAccountsUrl, bankAccounts, httpOptions)
              .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                tap( any => console.log(`A total of ${bankAccounts.length} bank accounts were successfully created.`)),
                catchError(me.operationHelper.handleError('BankAccount: failed to create new BankAccount.'))
              );
  }
}
