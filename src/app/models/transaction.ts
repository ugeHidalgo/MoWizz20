import { Concept } from './concept';
import { CostCentre } from './costCentre';
import { BankAccount } from './bankAccount';

export class Transaction {
    _id: string;
    amount: number;
    accountAmount: number;
    transactionType: number;
    concept: Concept;
    costCentre: CostCentre;
    account: BankAccount;
    comments: string;
    date: Date;
    company: string;
    __v: number;
}