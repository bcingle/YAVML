import { TestBed, inject } from '@angular/core/testing';

import { VehicleStore } from './vehicle-store.service';

describe('VehicleStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleStore]
    });
  });

  it('should be created', inject([VehicleStore], (service: VehicleStore) => {
    expect(service).toBeTruthy();
  }));
});
