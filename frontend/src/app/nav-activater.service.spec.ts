import { TestBed, inject } from '@angular/core/testing';

import { NavActivaterService } from './nav-activater.service';

describe('NavActivaterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavActivaterService]
    });
  });

  it('should be created', inject([NavActivaterService], (service: NavActivaterService) => {
    expect(service).toBeTruthy();
  }));
});
