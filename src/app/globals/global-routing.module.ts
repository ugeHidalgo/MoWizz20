import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MainScreenComponent } from '../components/main/mainScreen/main-screen.component';
import { LoginComponent } from '../login/login/login.component';
import { RegisterComponent } from '../login/register/register.component';
import { UserComponent } from '../login/user/user.component';

import { AccountsComponent } from '../components/main/accounts/accounts/accounts.component';
import { PageNotFoundComponent } from '../components/main/notFound/not-found.component';
import { ConceptsComponent } from '../components/main/concepts/concepts/concepts.component';
import { CostCentresComponent } from '../components/main/costCentres/cost-centres/cost-centres.component';
import { ImportDataComponent } from '../components/utilities/import-data/import-data.component';
import { TransactionTypesComponent } from '../components/main/transactionTypes/transaction-types/transaction-types.component';
import { TransactionsComponent } from '../components/main/transactions/transactions/transactions.component';
import { TransactionDetailComponent } from '../components/main/transactions/transaction-detail/transaction-detail.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user', component: UserComponent },
  { path: 'mainscreen', component: MainScreenComponent },
  { path: 'accounts', component: AccountsComponent },
  { path: 'cost-centres',  component: CostCentresComponent},
  { path: 'concepts', component: ConceptsComponent },
  { path: 'transactiontypes', component: TransactionTypesComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'transactiondetail/:id', component: TransactionDetailComponent },
  { path: 'import-data', component: ImportDataComponent },
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