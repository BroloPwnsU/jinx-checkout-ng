import { TestBed } from '@angular/core/testing';

import { AmazonPayService } from './amazon-pay.service';

describe('AmazonPayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AmazonPayService = TestBed.get(AmazonPayService);
    expect(service).toBeTruthy();
  });
});
