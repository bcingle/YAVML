import { TestBed, inject } from '@angular/core/testing';

import { NhtsaService } from './nhtsa.service';

describe('NhtsaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NhtsaService]
    });
  });

  it('should be created', inject([NhtsaService], (service: NhtsaService) => {
    expect(service).toBeTruthy();
  }));
});
