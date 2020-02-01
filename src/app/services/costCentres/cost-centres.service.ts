import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from 'src/app/globals/globals.service';
import { tap, catchError } from 'rxjs/operators';
import { OperationsHelper } from '../operations.helper';
import { Router } from '@angular/router';
import { CostCentre } from 'src/app/models/costCentre';

@Injectable({
  providedIn: 'root'
})
export class CostCentresService {

  private costCentresUrl;
  private operationHelper: OperationsHelper;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.costCentresUrl  = globals.server + 'api/costcentres';
    me.operationHelper = new OperationsHelper(globals,router);
  }

  /**.*/
  getCostCentres(company: string): Observable<CostCentre[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          costCentresForCompanyUrl = `${me.costCentresUrl}/${company}`;

    return me.http.get<CostCentre[]>(costCentresForCompanyUrl, httpOptions)
              .pipe(
                tap(any => console.log(`Cost centres for company ${company} fetched successfully.`)),
                catchError(me.operationHelper.handleError<CostCentre[]>('getCostCentres', []))
              );
  }

  /**.*/
  getActiveCostCentres(company: string): Observable<CostCentre[]> {
    const me = this,
          getUserNameCostCentresUrl = `${me.costCentresUrl}/${company}/true`,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return me.http.get<CostCentre[]>(getUserNameCostCentresUrl, httpOptions)
              .pipe(
                tap(any => console.log('Active cost centres fetched successfully.')),
                catchError(me.operationHelper.handleError<CostCentre[]>('getActiveCostCentres', []))
              );
  }

  /**.*/
  createCostCentres(costCentres: CostCentre[]): Observable<CostCentre[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken();

    return this.http.post<CostCentre[]>(me.costCentresUrl, costCentres, httpOptions)
              .pipe(
                // tslint:disable-next-line:no-shadowed-variable
                tap(any => console.log(`A total of ${costCentres.length} cost centres were successfully created.`)),
                catchError(me.operationHelper.handleError<CostCentre[]>('createCostCentres', []))
              );
  }
}

