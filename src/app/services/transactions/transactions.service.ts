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
}
