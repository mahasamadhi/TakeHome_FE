import { TestBed } from '@angular/core/testing';

import { CarDataDbService } from './car-data-db.service';

describe('CarDataDbService', () => {
  let service: CarDataDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarDataDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
