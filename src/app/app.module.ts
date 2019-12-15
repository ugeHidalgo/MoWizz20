import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// External libraries
import { ToastrModule } from 'ngx-toastr'; // Toaster library used to messaging

import { AppComponent } from './app.component';
import { GlobalRoutingModule } from './globals/global-routing.module';
import { MyMaterialModule } from './globals/material.module';

import { UsersService } from './services/users/users.service';
import { GlobalsService } from './globals/globals.service';
import { BankAccountsService } from './services/bankAccounts/bank-accounts.service';


import { PageNotFoundComponent } from './components/main/notFound/not-found.component';
import { ConceptsComponent } from './components/main/concepts/concepts/concepts.component'
import { BankAccountsComponent } from './components/main/bankAccounts/bank-accounts/bank-accounts.component';
import { MainScreenComponent } from './components/main/mainScreen/main-screen.component';
import { RegisterComponent } from './login/register/register.component';
import { LoginComponent } from './login/login/login.component';
import * as toastrCustomOptions from './messages/toastrCustomOptions';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    BankAccountsComponent,
    ConceptsComponent,
    MainScreenComponent,
    RegisterComponent,
    LoginComponent,
  ],
  imports: [
    GlobalRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MyMaterialModule,
    ToastrModule.forRoot(toastrCustomOptions.CustomOptions)
  ],
  providers: [
    GlobalsService,
    UsersService,
    BankAccountsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
