import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from 'src/app/globals/globals.service';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { OperationsHelper } from '../operations.helper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl;
  private grantUserAccessUrl;
  private operationHelper: OperationsHelper;

  constructor(
    private http: HttpClient,
    private globals: GlobalsService,
    private router: Router
  ) {
    const me = this;

    me.usersUrl  = globals.server + 'api/users';
    me.grantUserAccessUrl = globals.server + 'api/users/auth';
    me.operationHelper = new OperationsHelper(globals,router);
  }

  /**.*/
  getUser(userName: string): Observable<Account[]> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          getUserUrl = `${me.usersUrl}/${userName}`;

    return me.http.get<Account[]>(getUserUrl, httpOptions)
              .pipe(
                tap(any => console.log(`User ${userName} fetched successfully.`)),
                catchError(me.operationHelper.handleError('getUser', []))
              );
  }

  /**.*/
  registerUser(user: User): Observable<User> {
    const me = this;

    return me.http.post<User>(me.usersUrl, user)
    .pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap( (savedUser: User) => console.log(`User ${savedUser.userName} successfully created.`)),
      catchError(me.operationHelper.handleError<User>('registerUSer'))
    );
  }

  /**.*/
  updateUser(user: User): Observable<User> {
    const me = this,
          httpOptions = me.operationHelper.createHttpOptionsWithToken(),
          updateUserUrl = `${me.usersUrl}/update`;

    return me.http.post<User>(updateUserUrl, user, httpOptions)
    .pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap( (updatedUser: User) => console.log(`User ${updatedUser.userName} updated successfully created.`)),
      catchError(me.operationHelper.handleError<User>('updateUser'))
    );
  }

  /**.*/
  isUserAuthenticated(userData: any): Observable<any> {
    const me = this;

    return me.http.post<any>(me.grantUserAccessUrl, userData)
    .pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap( (loggedUser: User) => console.log(`User ${loggedUser.userName} successfully logged for company ${loggedUser.company}.`)),
      catchError(me.operationHelper.handleError<User>('isUserAuthenticated'))
    );
  }
}
