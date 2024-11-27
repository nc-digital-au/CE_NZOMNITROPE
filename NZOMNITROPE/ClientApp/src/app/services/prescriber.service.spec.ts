import { TestBed } from '@angular/core/testing';

import { PrescriberService } from './prescriber.service';

describe('PrescriberService', () => {
  let service: PrescriberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrescriberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
