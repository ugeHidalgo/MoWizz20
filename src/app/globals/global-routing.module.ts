import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BankAccountsComponent } from '../components/main/bankAccounts/bank-accounts/bank-accounts.component';
import { PageNotFoundComponent } from '../components/main/notFound/not-found.component';
import { ConceptsComponent } from '../components/main/concepts/concepts/concepts.component';
import { MainScreenComponent } from '../components/main/mainScreen/main-screen.component';
import { LoginComponent } from '../login/login/login.component';
import { RegisterComponent } from '../login/register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mainscreen', component: MainScreenComponent },
  { path: 'bankaccounts', component: BankAccountsComponent },
  { path: 'concepts', component: ConceptsComponent },
  { path: '', redirectTo: 'mainscreen', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],

  exports: [
    RouterModule
  ]
})

export class GlobalRoutingModule { }