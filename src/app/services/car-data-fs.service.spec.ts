import { TestBed } from '@angular/core/testing';

import { CarDataFsService } from './car-data-fs.service';

describe('CarDataFsService', () => {
  let service: CarDataFsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarDataFsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
