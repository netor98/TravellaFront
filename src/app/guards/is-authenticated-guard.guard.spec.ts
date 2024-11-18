import {TestBed} from '@angular/core/testing';
import {CanActivateFn} from '@angular/router';

import {isAuthenticatedGuardGuard} from './is-authenticated-guard.guard';

describe('isAuthenticatedGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isAuthenticatedGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
