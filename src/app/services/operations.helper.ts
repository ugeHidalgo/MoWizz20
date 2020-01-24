import { Observable, of, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { GlobalsService } from '../globals/globals.service';
import { Router } from '@angular/router';

export class OperationsHelper {

  constructor(
    private globals: GlobalsService,
    private router: Router
  ) {}


  /**
   * @param operation - name of the operation that failed.
   * @param result - optional value to return as the observable result
   */
  handleError<T>(operation = 'operation', result?: T) {
    const me = this;

    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      if (error.status === 401) {
        me.router.navigate(['/login']);
      }
      return of(result as T);
    };
  }

  /**.*/
  createHttpOptionsWithToken() {
    let authToken = this.globals.getTokenFromLocalStorage();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      })
    };
  }
};