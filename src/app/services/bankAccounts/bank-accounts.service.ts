import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BankAccount } from '../../models/bankAccount';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { GlobalsService } from 'src/app/globals/globals.service';


@Injectable({
  providedIn: 'root'
})
export class BankAccountsService {

  private bankAccountsUrl;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService
  ) {
    this.bankAccountsUrl  = globals.server + 'api/bankaccounts';
  }

  /**.*/
  getBankAccounts(): Observable<BankAccount[]> {
    const me = this,
          httpOptions = me.createHttpOptionsWithToken();

    return me.http.get<BankAccount[]>(me.bankAccountsUrl, httpOptions)
              .pipe(
                tap(any => console.log('Bank accounts fetched successfully.')),
                catchError(me.handleError('getBankAccounts', []))
              );
  }

  //---- Private methods
  /**
   * @param operation - name of the operation that failed.
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    const me = this;

    return (error: any): Observable<T> => {
      /* if (error.status === 401) {
        me.router.navigate(['/login']);
      } */
      // console.error(error.error.message);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  /**.*/
  private createHttpOptionsWithToken() {
    let authToken = this.globals.getTokenFromLocalStorage();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      })
    };
  }
}
