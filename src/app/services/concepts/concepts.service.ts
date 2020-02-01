import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from 'src/app/globals/globals.service';
import { tap, catchError } from 'rxjs/operators';
import { OperationsHelper } from '../operations.helper';
import { Router } from '@angular/router';
import { Concept } from 'src/app/models/concept';
import { TransactionType } from 'src/app/models/transactionType';

@Injectable({
  providedIn: 'root'
})
export class ConceptsService {

  private conceptsUrl;
  private operationHelper: OperationsHelper;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.conceptsUrl  = globals.server + 'api/concepts';
    me.operationHelper = new OperationsHelper(globals,router);
  }

  /**.*/
  getConcepts(company: string): Observable<Concept[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          conceptsForCompanyUrl = `${me.conceptsUrl}/${company}`;

    return me.http.get<Concept[]>(conceptsForCompanyUrl, httpOptions)
              .pipe(
                tap(any => console.log(`Concepts for company ${company} fetched successfully.`)),
                catchError(me.operationHelper.handleError<Concept[]>('getConcepts', []))
              );
  }

  /**.*/
  getActiveConceptsByType(company: string, transactionType: number): Observable<Concept[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          activeConceptsByTypeCompanyAndTypeUrl = `${me.conceptsUrl}/${company}/${transactionType}/true`;

    return me.http.get<Concept[]>(activeConceptsByTypeCompanyAndTypeUrl, httpOptions)
              .pipe(
                tap(any => console.log(`Concepts of type ${transactionType}, fetched successfully.`)),
                catchError(me.operationHelper.handleError<Concept[]>('getActiveConceptsByType', []))
              );
  }

  /**.*/
  createConcepts(concepts: Concept[]): Observable<Concept[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return this.http.post<Concept[]>(me.conceptsUrl, concepts, httpOptions)
              .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                tap(_ => console.log(`A total of ${concepts.length} concepts were successfully created.`)),
                catchError(me.operationHelper.handleError<Concept[]>('createConcepts', []))
              );
  }
}
