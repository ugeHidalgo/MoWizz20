import { Component, ViewContainerRef } from '@angular/core';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/users/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  user: User = new User();
  loading = false;
  validatingForm: FormGroup;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private toastr: ToastrService,
    private routeLocation: Location,
    private fb: FormBuilder
    //vcr: ViewContainerRef
    ) {
      //this.toastr.setRootViewContainerRef(vcr);
      this.createForm();
  }

  createForm() {
    this.validatingForm = this.fb.group({
      userName: [ '', Validators.required ],
      firstName: '',
      lastName: '',
      password: '',
      eMail: [ '', Validators.email ]
    });
  }

  register() {
    const me = this;

    me.loading = true;
    me.usersService.registerUser(me.user)
      .subscribe(
        newUserAdded => {
          me.toastr.success(`User ${newUserAdded.userName} was successfully added.`);
          me.router.navigate(['/login']);
        },
        error => {
          me.toastr.error(error.message);
          me.loading = false;
        }
      );
  }

  close() {
    this.routeLocation.back();
  }
}
