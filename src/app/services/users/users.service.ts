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
  private operationHelper;

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
  registerUser(user: User): Observable<User> {
    const me = this;

    return me.http.post<User>(this.usersUrl, user)
    .pipe(
      // tslint:disable-next-line:no-shadowed-variable
      tap( (savedUser: User) => console.log(`User ${savedUser.userName} successfully created.`)),
      catchError(me.operationHelper.handleError('Failed to create new user.'))
    );
  }

  /**.*/
  isUserAuthenticated(userData: any): Observable<any> {
    return this.http.post<any>(this.grantUserAccessUrl, userData);
  }
}
