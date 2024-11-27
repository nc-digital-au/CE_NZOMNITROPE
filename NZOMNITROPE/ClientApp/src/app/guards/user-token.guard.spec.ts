import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userTokenGuard } from './user-token.guard';

describe('userTokenGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userTokenGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
