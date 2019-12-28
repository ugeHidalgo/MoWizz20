import { Component, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/globals/globals.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  user: User = new User();
  validatingForm: FormGroup;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private toastr: ToastrService,
    private routeLocation: Location,
    private fb: FormBuilder,
    private globals: GlobalsService
    ) {
      this.createForm();
  }

  createForm() {
    this.validatingForm = this.fb.group({
      userName: [ '', Validators.required ],
      firstName: '',
      lastName: '',
      password: '',
      eMail: [ '', Validators.email ],
      company: [ '', Validators.required ]
    });
  }

  register() {
    const me = this;

    me.globals.maskScreen();
    me.usersService.registerUser(me.user)
      .subscribe(
        newUserAdded => {
          me.globals.unMaskScreen();
          me.toastr.success(`User ${newUserAdded.userName} was successfully added.`);
          me.router.navigate(['/login']);
        },
        error => {
          me.globals.unMaskScreen();
          me.toastr.error(error.message);
        }
      );
  }

  close() {
    this.routeLocation.back();
  }
}
