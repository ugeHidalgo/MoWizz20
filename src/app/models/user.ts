import { CostCentre } from './costCentre';
import { Account } from './account';

export class User {
  _id: string;
  userName: string;
  company: string;
  password: string;
  firstName: string;
  lastName: string;
  active: boolean;
  created: Date;
  updated: Date;
  eMail: string;
  transactionType: number;
  costCentre: CostCentre;
  account: Account;
}