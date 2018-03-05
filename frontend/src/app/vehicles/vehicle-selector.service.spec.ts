import { TestBed, inject } from '@angular/core/testing';

import { VehicleSelectorService } from './vehicle-selector.service';

describe('VehicleSelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleSelectorService]
    });
  });

  it('should be created', inject([VehicleSelectorService], (service: VehicleSelectorService) => {
    expect(service).toBeTruthy();
  }));
});
