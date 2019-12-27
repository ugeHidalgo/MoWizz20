import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from 'src/app/globals/globals.service';
import { BankAccount } from '../../models/bankAccount';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OperationsHelper } from '../operations.helper';


@Injectable({
  providedIn: 'root'
})
export class BankAccountsService {
  private bankAccountsUrl;
  private operationHelper: OperationsHelper;

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
                catchError(me.operationHelper.handleError<BankAccount[]>('createBankAccounts', []))
              );
  }
}
