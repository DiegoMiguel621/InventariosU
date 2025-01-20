import { TestBed } from '@angular/core/testing';

import { BienesService } from './bienes.service';

describe('BienesService', () => {
  let service: BienesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BienesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
