import { TestBed } from '@angular/core/testing';

import { BankAccountsService } from './bank-accounts.service';

describe('BankAccountsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BankAccountsService = TestBed.get(BankAccountsService);
    expect(service).toBeTruthy();
  });
});
