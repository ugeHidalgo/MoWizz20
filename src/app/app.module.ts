import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Locale
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import loacaleEs from '@angular/common/locales/es'
registerLocaleData(loacaleEs);

// External libraries
import { ToastrModule } from 'ngx-toastr'; // Toaster library used to messaging
import * as toastrCustomOptions from './messages/toastrCustomOptions';

import { AppComponent } from './app.component';
import { GlobalRoutingModule } from './globals/global-routing.module';
import { MyMaterialModule } from './globals/material.module';

import { TransactionTypePipe } from './pipes/TransactionTypePipe';
import { EuroCurrencyPipe } from './pipes/EuroCurrencyPipe';

import { UsersService } from './services/users/users.service';
import { GlobalsService } from './globals/globals.service';
import { AccountsService } from './services/accounts/accounts.service';

import { MainScreenComponent } from './components/main/mainScreen/main-screen.component';

import { RegisterComponent } from './login/register/register.component';
import { LoginComponent } from './login/login/login.component';
import { UserComponent } from './login/user/user.component';

import { PageNotFoundComponent } from './components/main/notFound/not-found.component';
import { ConceptsComponent } from './components/main/concepts/concepts/concepts.component'
import { AccountsComponent } from './components/main/accounts/accounts/accounts.component';
import { ImportDataComponent } from './components/utilities/import-data/import-data.component';
import { TransactionsComponent } from './components/main/transactions/transactions/transactions.component';
import { TransactionTypesComponent } from './components/main/transactionTypes/transaction-types/transaction-types.component';
import { TransactionDetailComponent } from './components/main/transactions/transaction-detail/transaction-detail.component';
import { CostCentresComponent } from './components/main/costCentres/cost-centres/cost-centres.component';
import { DeleteDialogComponent } from './components/dialogs/delete-dialog/delete-dialog.component';
import { UpdateAmountDialogComponent } from './components/dialogs/update-amount-dialog/update-amount-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AccountsComponent,
    ConceptsComponent,
    MainScreenComponent,
    RegisterComponent,
    LoginComponent,
    ImportDataComponent,
    TransactionsComponent,
    TransactionTypesComponent,
    TransactionTypePipe,
    EuroCurrencyPipe,
    TransactionDetailComponent,
    CostCentresComponent,
    UserComponent,
    DeleteDialogComponent,
    UpdateAmountDialogComponent
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
    AccountsService,
    { provide: LOCALE_ID, useValue: 'es'}
  ],
  entryComponents: [
    DeleteDialogComponent,
    UpdateAmountDialogComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
