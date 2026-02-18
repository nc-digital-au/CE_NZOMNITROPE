import { of } from 'rxjs';

import { AppHorizontalNavItemComponent } from './nav-item.component';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavService } from 'src/app/services/nav.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { routeLinks } from 'src/app/utils/routes';

class AuthenticationServiceStub {
  getIsAuthenticated() {
    return of(true);
  }

  signOut(): void {}
}

class RouterStub {
  navigate = jasmine.createSpy('navigate');
}

class NavServiceStub {}

class MatDialogStub {}

describe('AppHorizontalNavItemComponent', () => {
  let component: AppHorizontalNavItemComponent;
  let authService: AuthenticationServiceStub;
  let router: RouterStub;

  beforeEach(() => {
    authService = new AuthenticationServiceStub();
    router = new RouterStub();
    const navService = new NavServiceStub();
    const dialog = new MatDialogStub();

    component = new AppHorizontalNavItemComponent(
      authService as unknown as AuthenticationService,
      navService as unknown as NavService,
      router as unknown as Router,
      dialog as unknown as MatDialog,
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sign out and redirect to /.auth/logout when logout item is selected and user is authenticated', () => {
    spyOn(authService, 'getIsAuthenticated').and.returnValue(of(true));
    spyOn(authService, 'signOut');
    const originalHref = window.location.href;
    const item = { logout: true } as any;

    component.onItemSelected(item);

    expect(authService.getIsAuthenticated).toHaveBeenCalled();
    expect(authService.signOut).toHaveBeenCalled();
    expect(window.location.href).toContain('/.auth/logout?landingpage=/landing');

    // reset href to avoid side effects in test runner
    window.location.href = originalHref;
  });

  it('should navigate to landing when logout item is selected and user is anonymous', () => {
    spyOn(authService, 'getIsAuthenticated').and.returnValue(of(false));
    const item = { logout: true } as any;

    component.onItemSelected(item);

    expect(authService.getIsAuthenticated).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith([routeLinks.landing]);
  });
});

