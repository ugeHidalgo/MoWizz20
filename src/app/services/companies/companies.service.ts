import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from 'src/app/globals/globals.service';
import { Company } from 'src/app/models/company';
import { tap, catchError } from 'rxjs/operators';
import { OperationsHelper } from '../operations.helper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  private companiesUrl;
  private operationHelper: OperationsHelper;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.companiesUrl  = globals.server + 'api/companies';
    me.operationHelper = new OperationsHelper(globals,router);
  }

  /**.*/
  getCompanies(): Observable<Company[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return me.http.get<Company[]>(me.companiesUrl, httpOptions)
              .pipe(
                tap(any => console.log('Companies fetched successfully.')),
                catchError(me.operationHelper.handleError<Company[]>('getCompanies', []))
              );
  }

  /**.*/
  createCompanies(companies: Company[]): Observable<Company[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return this.http.post<Company[]>(me.companiesUrl, companies, httpOptions)
              .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                tap(any => console.log(`A total of ${companies.length} companies were successfully created.`)),
                catchError(me.operationHelper.handleError<Company[]>('createCompanies', []))
              );
  }
}
