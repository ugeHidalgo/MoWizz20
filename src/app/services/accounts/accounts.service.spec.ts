import { TestBed } from '@angular/core/testing';

import { AccountsService } from './accounts.service';

describe('BankAccountsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountsService = TestBed.get(AccountsService);
    expect(service).toBeTruthy();
  });
});
