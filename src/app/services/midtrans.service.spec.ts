import { TestBed } from '@angular/core/testing';

import { MidtransService } from './midtrans.service';

describe('MidtransService', () => {
  let service: MidtransService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MidtransService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
