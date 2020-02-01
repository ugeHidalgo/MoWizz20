import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from 'src/app/globals/globals.service';
import { Account } from '../../models/account';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { OperationsHelper } from '../operations.helper';


@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private accountsUrl;
  private operationHelper: OperationsHelper;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.accountsUrl  = globals.server + 'api/accounts';
    me.operationHelper = new OperationsHelper(globals,router);
  }

  /**.*/
  getAccounts(company: string): Observable<Account[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          accountsForCompanyUrl = `${me.accountsUrl}/${company}`;

    return me.http.get<Account[]>(accountsForCompanyUrl, httpOptions)
              .pipe(
                tap(any => console.log(`Accounts for company ${company} fetched successfully.`)),
                catchError(me.operationHelper.handleError('getAccountsForCompany', []))
              );
  }

  /**.*/
  getActiveAccounts(company: string): Observable<Account[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          activeAccountsForCompanyUrl = `${me.accountsUrl}/${company}/true`;

    return me.http.get<Account[]>(activeAccountsForCompanyUrl, httpOptions)
              .pipe(
                tap(any => console.log(`Active accounts for company ${company} fetched successfully.`)),
                catchError(me.operationHelper.handleError('getActiveAccounts', []))
              );
  }

  /**.*/
  createAccounts(accounts: Account[]): Observable<Account[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return this.http.post<Account[]>(me.accountsUrl, accounts, httpOptions)
              .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                tap( any => console.log(`A total of ${accounts.length} accounts were successfully created.`)),
                catchError(me.operationHelper.handleError<Account[]>('createAccounts', []))
              );
  }
}
