import { TestBed } from '@angular/core/testing';

import { UserVideoService } from './uservideo.service';

describe('UserVideoService', () => {
  let service: UserVideoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserVideoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
