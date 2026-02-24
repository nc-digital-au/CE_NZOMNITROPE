// src/app/services/auth.service.ts
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, shareReplay, Observable, defer, of, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment';

// OidcProxy.Net BFF endpoints
const AUTH_ENDPOINTS = {
  login: '/.auth/login',
  logout: '/auth/logout',
  me: '/.auth/me',
  token: '/.auth/token',
  forgotPassword: '/.auth/forgot-password'
} as const;

const ANONYMOUS: Session = null;
const CACHE_SIZE = 1;

// Development fallback role when auth is disabled
// TODO: Set to 'pharmacist' to test pharmacist role, or null to disable
const DEV_FALLBACK_ROLE: 'patient' | 'pharmacist' | null = 'patient';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _session$: Observable<Session> | null = null;
  private _currentUser: AuthenticatedUser;
  private _roles: string[] = [];
  private readonly requiredRole = 'patient';
  private readonly systemRoles = [
    'offline_access',
    'uma_authorization',
    'default-roles-commercial-eyes',
    'create-realm',
    'admin',
    'uma_protection'
  ];

  public get currentUser(): AuthenticatedUser {
    return this._currentUser;
  }

  constructor(private readonly _http: HttpClient) { }

  public get roles(): string[] {
    return this._roles;
  }

  public getLogoutUrl(): Observable<string> {
    return of('/.auth/end-session');
  }

  public getSession(ignoreCache: boolean = true) {
    if (!this._session$ || ignoreCache) {
      this._session$ = this._http.get<any>('/.auth/me').pipe(
        map(user => {
          if (!user) {
            this._roles = [];
            return ANONYMOUS;
          }

          const claims = this.mapUserToClaims(user);
          this._roles = this.extractRolesFromSession(user, claims);

          if (claims.length) {
            this._currentUser = new AuthenticatedUser(claims);
            return claims;
          }

          return ANONYMOUS;
        }),
        catchError(() => of(ANONYMOUS)),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.session$;
  }

  public getIsAuthenticated(ignoreCache: boolean = false) {
    return this.getSession(ignoreCache).pipe(
      map(s => this.userIsAuthenticated(s))
    );
  }

  public getIsAnonymous(ignoreCache: boolean = false) {
    return this.getSession(ignoreCache).pipe(
      map(s => !this.userIsAuthenticated(s))
    );
  }

  public getUsername(ignoreCache: boolean = false) {
    return this.getSession(ignoreCache).pipe(
      filter(this.userIsAuthenticated),
      map(s => s.find(c => c.type === 'name')?.value)
    );
  }

  public signOut(): void {
    if (this._currentUser) {
      this._currentUser.clearLocalStorage()
    }
  }

  private userIsAuthenticated(s: Session): s is Claim[] {
    return s !== null && this._roles.includes(this.requiredRole);
  }

  private extractAccountId(claims: Record<string, unknown> | null): string | null {
    if (!claims) return null;

    const possibleKeys = ['AccountId', 'account_id', 'accountid', 'account-id'];
    for (const key of possibleKeys) {
      if (claims[key]) {
        return String(claims[key]);
      }
    }

    const key = Object.keys(claims).find(k => /^accountid$/i.test(k));
    return key ? String(claims[key]) : null;
  }

  private mapUserToClaims(user: unknown): Claim[] {
    if (Array.isArray(user)) {
      return user
        .filter(claim => typeof claim?.type === 'string')
        .map(claim => ({
          type: claim.type,
          value: claim.value != null ? String(claim.value) : ''
        }));
    }

    if (user && typeof user === 'object') {
      return Object.entries(user).map(([type, value]) => ({
        type,
        value: value != null ? String(value) : ''
      }));
    }

    return [];
  }

  private extractRolesFromSession(user: unknown, claims: Claim[]): string[] {
    const roles = new Set<string>();

    claims.forEach(claim => {
      if (claim.type === 'role' || claim.type === 'roles' || claim.type === 'groups') {
        this.addRolesFromProperty(claim.value, roles);
      }
      if (claim.type === 'realm_access') {
        this.parseKeycloakRealmAccess(claim.value, roles);
      }
      if (claim.type === 'resource_access') {
        this.parseKeycloakResourceAccess(claim.value, roles);
      }
    });

    if (user && typeof user === 'object' && !Array.isArray(user)) {
      const payload = user as Record<string, unknown>;
      this.addRolesFromProperty(payload['role'], roles);
      this.addRolesFromProperty(payload['roles'], roles);
      this.addRolesFromProperty(payload['groups'], roles);

      const realmAccess = payload['realm_access'] as Record<string, unknown> | undefined;
      if (realmAccess?.['roles']) {
        this.addRolesFromProperty(realmAccess['roles'], roles);
      }

      const resourceAccess = payload['resource_access'] as Record<string, unknown> | undefined;
      if (resourceAccess && typeof resourceAccess === 'object') {
        Object.values(resourceAccess).forEach((client: unknown) => {
          const clientObj = client as Record<string, unknown> | undefined;
          if (clientObj?.['roles']) {
            this.addRolesFromProperty(clientObj['roles'], roles);
          }
        });
      }
    }

    return Array.from(roles);
  }

  private addRolesFromProperty(value: unknown, roles: Set<string>): void {
    if (!value) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(role => {
        if (typeof role !== 'string') {
          return;
        }

        const normalizedRole = role.toLowerCase();
        if (!this.systemRoles.includes(normalizedRole)) {
          roles.add(normalizedRole);
        }
      });
      return;
    }

    if (typeof value === 'string') {
      const normalizedRole = value.toLowerCase();
      if (!this.systemRoles.includes(normalizedRole)) {
        roles.add(normalizedRole);
      }
    }
  }

  private parseKeycloakRealmAccess(jsonString: string, roles: Set<string>): void {
    try {
      const parsed = JSON.parse(jsonString) as Record<string, unknown>;
      this.addRolesFromProperty(parsed['roles'], roles);
    } catch {
    }
  }

  private parseKeycloakResourceAccess(jsonString: string, roles: Set<string>): void {
    try {
      const parsed = JSON.parse(jsonString) as Record<string, unknown>;
      Object.values(parsed).forEach((client: unknown) => {
        const clientObj = client as Record<string, unknown> | undefined;
        if (clientObj?.['roles']) {
          this.addRolesFromProperty(clientObj['roles'], roles);
        }
      });
    } catch {
    }
  }
}