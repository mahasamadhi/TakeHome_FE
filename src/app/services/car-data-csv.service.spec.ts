import { TestBed } from '@angular/core/testing';

import { CarDataCsvService } from './car-data-csv.service';

describe('CarDataCsvService', () => {
  let service: CarDataCsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarDataCsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
