import { TestBed } from '@angular/core/testing';

import { CsvService } from './csv.service';

describe('DataService', () => {
  let service: CsvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
