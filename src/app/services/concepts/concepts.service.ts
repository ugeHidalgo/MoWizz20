import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from 'src/app/globals/globals.service';
import { tap, catchError } from 'rxjs/operators';
import { OperationsHelper } from '../operations.helper';
import { Router } from '@angular/router';
import { Concept } from 'src/app/models/concept';

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
  getConcepts(): Observable<Concept[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return me.http.get<Concept[]>(me.conceptsUrl, httpOptions)
              .pipe(
                tap(any => console.log('Concepts fetched successfully.')),
                catchError(me.operationHelper.handleError<Concept[]>('getConcepts', []))
              );
  }

  /**.*/
  createConcepts(concepts: Concept[]): Observable<Concept[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return this.http.post<Concept[]>(me.conceptsUrl, concepts, httpOptions)
              .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                tap(any => console.log(`A total of ${concepts.length} concepts were successfully created.`)),
                catchError(me.operationHelper.handleError<Concept[]>('createConcepts', []))
              );
  }
}
