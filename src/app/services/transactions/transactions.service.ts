import { Injectable } from '@angular/core';
import { ImportTransaction } from 'src/app/components/utilities/import-data/models/import.transaction';
import { Transaction } from 'src/app/models/transaction';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OperationsHelper } from '../operations.helper';
import { GlobalsService } from 'src/app/globals/globals.service';
import { Router } from '@angular/router';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  private transactionsUrl: string;
  private transactionsImportUrl: string;
  private operationHelper: OperationsHelper;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.transactionsUrl  = globals.server + 'api/transactions';
    me.transactionsImportUrl  = globals.server + 'api/transactions/import';
    me.operationHelper = new OperationsHelper(globals,router);
  }

    /**.*/
  getTransactionById(company: string, id: string): Observable<Transaction> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          getTransactionByIdUrl = `${me.transactionsUrl}/${company}/${id}`,
          transaction = me.http.get<Transaction>(getTransactionByIdUrl, httpOptions)
                      .pipe(
                        tap(_ => console.log(`Transaction with id ${id} for company ${company} was fetched.`)),
                        catchError(me.operationHelper.handleError<Transaction>(`getTransactionById (userName:${company}, id:${id})`))
                      );
    return transaction;
  }

  /**.*/
  getTransactionsForCompany(company: string): Observable<Transaction[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          transactionsForCompanyUrl = `${me.transactionsUrl}/${company}`;

    return me.http.get<Transaction[]>(transactionsForCompanyUrl, httpOptions)
              .pipe(
                tap(any => console.log(`Transactions for company ${company} fetched successfully.`)),
                catchError(me.operationHelper.handleError('getTransactionsForCompany', []))
              );
  }

  /**.*/
  importTransactions(transactiosToImport: ImportTransaction[]): Observable<Transaction[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return this.http.post<Transaction[]>(me.transactionsImportUrl, transactiosToImport, httpOptions)
              .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                tap(any => console.log(`A total of ${transactiosToImport.length} transactions were successfully imported.`)),
                catchError(me.operationHelper.handleError<Transaction[]>('importConcepts', []))
              );
  }

  /**.*/
  createOrUpdateTransaction(transaction: Transaction): Observable<Transaction> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return this.http.post<Transaction>(me.transactionsUrl, transaction, httpOptions)
              .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                tap(any => console.log('Transaction successfully saved.')),
                catchError(me.operationHelper.handleError<Transaction>('createOrUpdateTransaction', null))
              );
  }

  /**.*/
  deleteTransactionById(company: string, id: string): Observable<boolean> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          deleteTransactionByIdUrl = `${me.transactionsUrl}/${company}/${id}`,
          success = me.http.delete<boolean>(deleteTransactionByIdUrl, httpOptions)
                      .pipe(
                        tap(_ => console.log(`Transaction with id ${id} for user ${company} was deleted.`)),
                        catchError(me.operationHelper.handleError<boolean>(`deleteTransactionById (userName:${company}, id:${id})`))
                      );
    return success;
  }
}
