import { TestBed, inject } from '@angular/core/testing';

import { NewVehicleService } from './new-vehicle.service';

describe('NewVehicleServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewVehicleService]
    });
  });

  it('should be created', inject([NewVehicleService], (service: NewVehicleService) => {
    expect(service).toBeTruthy();
  }));
});
