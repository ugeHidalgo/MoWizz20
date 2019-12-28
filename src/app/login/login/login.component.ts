import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from 'src/app/globals/globals.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  model: any = {};
  angular: any;

  constructor(
    private router: Router,
    private routeLocation: Location,
    protected globals: GlobalsService,
    private usersService: UsersService,
    private toastr: ToastrService, ) {
  }

  login() {
    const me = this;

    me.globals.maskScreen();
    me.usersService.isUserAuthenticated(me.model)
      .subscribe(
        data => {
          me.globals.setUser(me.model.userName);
          me.globals.setCompany(data.company);
          me.globals.storeUserDataInLocalStorage(me.model.userName, data.company, data.token);
          me.globals.unMaskScreen();
          me.toastr.success("Bienvenido " + me.model.userName);
          me.router.navigate(['/mainscreen']);
        },
        error => {
          let errorMessage = error.message;
          if (error.status === 401)
          {
            errorMessage = 'Usuario o contraseña erróneos. Inténtelo de nuevo.';
          }
          me.globals.clearUser();
          me.globals.unMaskScreen();
          me.toastr.error(errorMessage);
        }
      );
  }

  close() {
    this.routeLocation.back();
  }
}
