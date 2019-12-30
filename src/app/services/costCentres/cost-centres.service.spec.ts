import { TestBed } from '@angular/core/testing';

import { CostCentresService } from './cost-centres.service';

describe('CostCentresService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CostCentresService = TestBed.get(CostCentresService);
    expect(service).toBeTruthy();
  });
});
