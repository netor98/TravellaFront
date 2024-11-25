import {TestBed} from '@angular/core/testing';

import {FiltersTripsService} from './filters-trips.service';

describe('FiltersTripsService', () => {
  let service: FiltersTripsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltersTripsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
