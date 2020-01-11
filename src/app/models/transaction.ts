import { Concept } from './concept';
import { CostCentre } from './costCentre';
import { Account } from './account';

export class Transaction {
    _id: string;
    amount: number;
    accountAmount: number;
    transactionType: number;
    concept: Concept;
    costCentre: CostCentre;
    account: Account;
    comments: string;
    date: Date;
    company: string;
    __v: number;
}