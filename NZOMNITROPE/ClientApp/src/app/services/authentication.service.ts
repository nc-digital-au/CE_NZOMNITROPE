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
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private session$: Observable<Session> | null = null;

  // Create a signal from the getSession() observable
  public session: Signal<Session> = toSignal(
    defer(() => this.getSession()),
    { initialValue: ANONYMOUS }
  );

  // Derived signals using computed that automatically update
  public isAuthenticated = computed(() => this.session() !== null);
  public isAnonymous = computed(() => this.session() === null);

  public username = computed(() => {
    const session = this.session();
    if (!session) return null;

    if (Array.isArray(session)) {
      return session.find(c => c.type === 'name')?.value ?? null;
    }
    return (session as Record<string, unknown>)['name'] as string ?? null;
  });

  public email = computed(() => {
    const session = this.session();
    if (!session) return null;

    if (Array.isArray(session)) {
      return session.find(c => c.type === 'email')?.value ?? null;
    }
    return (session as Record<string, unknown>)['email'] as string ?? null;
  });

  // Extract claims directly from session (JWT from /.auth/me)
  public claims = computed(() => {
    const session = this.session();
    if (!session) return null;

    if (Array.isArray(session)) {
      const claimsDict: Record<string, string> = {};
      session.forEach(claim => {
        if (claim?.type && claim?.value) {
          claimsDict[claim.type] = claim.value;
        }
      });
      return claimsDict;
    }
    return session as Record<string, unknown>;
  });

  public rolesFromClaims = computed(() => {
    const session = this.session();
    const roles = this.extractRolesFromSession(session);

    // In development, if no roles detected, use fallback role for testing
    if (!environment.production && roles.length === 0 && DEV_FALLBACK_ROLE) {
      return [DEV_FALLBACK_ROLE];
    }

    return roles;
  });

  public programIdFromClaims = computed(() => this.extractProgramId(this.claims()));
  public accountId = computed(() => this.extractAccountId(this.claims()));

  constructor() {}

  // -------------------------------------------------------------------------
  // Observable Methods for Guards and Components
  // -------------------------------------------------------------------------

  /**
   * Return authenticated state as Observable (for guards)
   */
  public getIsAuthenticated(): Observable<boolean> {
    return this.getSession().pipe(
      map(() => this.isAuthenticated()),
      catchError(() => of(false))
    );
  }

  /**
   * Return anonymous state as Observable (for guards)
   */
  public getIsAnonymous(): Observable<boolean> {
    return this.getSession().pipe(
      map(() => this.isAnonymous()),
      catchError(() => of(true))
    );
  }

  /**
   * Return username as Observable (for components)
   */
  public getUsername(): Observable<string | null> {
    return this.getSession().pipe(
      map(() => this.username()),
      catchError(() => of(null))
    );
  }

  // -------------------------------------------------------------------------
  // Authentication Actions
  // -------------------------------------------------------------------------

  /**
   * Redirect to OidcProxy login endpoint
   */
  public login(returnUrl?: string): void {
    const url = returnUrl
      ? `${AUTH_ENDPOINTS.login}?returnUrl=${encodeURIComponent(returnUrl)}`
      : AUTH_ENDPOINTS.login;
    window.location.href = url;
  }

  /**
   * Redirect to OidcProxy logout endpoint and clear session
   */
  public logout(): void {
    this.clearSessionCache();
    const returnUrl = encodeURIComponent(`${window.location.origin}/`);
    window.location.assign(`${AUTH_ENDPOINTS.logout}?returnUrl=${returnUrl}`);
  }

  /**
   * Alias for logout() for compatibility with existing code
   */
  public signOut(): void {
    this.logout();
  }

  /**
   * Redirect to forgot password page
   */
  public forgotPassword(): void {
    window.location.href = AUTH_ENDPOINTS.forgotPassword;
  }

  // -------------------------------------------------------------------------
  // Session Management
  // -------------------------------------------------------------------------

  public getSession(ignoreCache: boolean = false): Observable<Session> {
    if (!this.session$ || ignoreCache) {
      this.session$ = this.http.get<Session>(AUTH_ENDPOINTS.me).pipe(
        catchError((err: HttpErrorResponse) => {
          this.clearSessionCache();

          // Redirect to landing on auth error for protected routes
          if (err.status === 401 || err.status === 403) {
            const currentUrl = this.router.url;
            const publicRoutes = ['/', '/register', '/terms', '/privacy', '/contact', '/error'];
            const isPublicRoute = publicRoutes.some(route => currentUrl.startsWith(route));

            if (!isPublicRoute) {
              this.router.navigate(['/'], { queryParams: { returnUrl: currentUrl } });
            }
          }

          return of(ANONYMOUS);
        }),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.session$;
  }

  /**
   * Clear the cached session
   */
  public clearSessionCache(): void {
    this.session$ = null;
  }

  // -------------------------------------------------------------------------
  // Role Extraction (Keycloak-compatible)
  // -------------------------------------------------------------------------

  /**
   * System roles to exclude from user roles
   */
  private readonly systemRoles = [
    'offline_access',
    'uma_authorization',
    'default-roles-commercial-eyes',
    'create-realm',
    'admin',
    'uma_protection'
  ];

  /**
   * Extract roles from session (JWT claims from /.auth/me)
   * Handles Keycloak's complex role structures
   */
  private extractRolesFromSession(session: Session): string[] {
    if (!session) return [];

    const roles = new Set<string>();

    if (Array.isArray(session)) {
      this.extractRolesFromClaimArray(session, roles);
    } else {
      this.extractRolesFromJwtPayload(session as Record<string, unknown>, roles);
    }

    return Array.from(roles);
  }

  private extractRolesFromClaimArray(claims: Claim[], roles: Set<string>): void {
    // Direct 'role' claims
    claims.forEach(claim => {
      if (claim.type === 'role' && claim.value && !this.systemRoles.includes(claim.value.toLowerCase())) {
        roles.add(claim.value.toLowerCase());
      }
    });

    // Keycloak realm_access claim (JSON string)
    const realmAccessClaim = claims.find(c => c.type === 'realm_access');
    if (realmAccessClaim?.value) {
      this.parseKeycloakRoles(realmAccessClaim.value, roles, true);
    }

    // Keycloak resource_access claim (JSON string)
    const resourceAccessClaim = claims.find(c => c.type === 'resource_access');
    if (resourceAccessClaim?.value) {
      this.parseKeycloakResourceRoles(resourceAccessClaim.value, roles, true);
    }
  }

  private extractRolesFromJwtPayload(payload: Record<string, unknown>, roles: Set<string>): void {
    // Direct role/roles properties
    this.addRolesFromProperty(payload['role'], roles);
    this.addRolesFromProperty(payload['roles'], roles);
    this.addRolesFromProperty(payload['groups'], roles);

    // Keycloak realm_access (object)
    const realmAccess = payload['realm_access'] as Record<string, unknown> | undefined;
    if (realmAccess?.['roles']) {
      this.addRolesFromProperty(realmAccess['roles'], roles);
    }

    // Keycloak resource_access (object)
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

  private addRolesFromProperty(value: unknown, roles: Set<string>): void {
    if (!value) return;

    if (Array.isArray(value)) {
      value.forEach((role: unknown) => {
        if (typeof role === 'string' && !this.systemRoles.includes(role.toLowerCase())) {
          roles.add(role.toLowerCase());
        }
      });
    } else if (typeof value === 'string' && !this.systemRoles.includes(value.toLowerCase())) {
      roles.add(value.toLowerCase());
    }
  }

  private parseKeycloakRoles(jsonString: string, roles: Set<string>, isRealmAccess: boolean): void {
    try {
      const parsed = JSON.parse(jsonString);
      if (isRealmAccess && parsed.roles && Array.isArray(parsed.roles)) {
        this.addRolesFromProperty(parsed.roles, roles);
      }
    } catch {
      // Invalid JSON, ignore
    }
  }

  private parseKeycloakResourceRoles(jsonString: string, roles: Set<string>, _isResourceAccess: boolean): void {
    try {
      const resourceAccess = JSON.parse(jsonString);
      Object.values(resourceAccess).forEach((client: unknown) => {
        const clientObj = client as Record<string, unknown> | undefined;
        if (clientObj?.['roles'] && Array.isArray(clientObj['roles'])) {
          this.addRolesFromProperty(clientObj['roles'], roles);
        }
      });
    } catch {
      // Invalid JSON, ignore
    }
  }

  // -------------------------------------------------------------------------
  // Claim Extraction Utilities
  // -------------------------------------------------------------------------

  private extractProgramId(claims: Record<string, unknown> | null): string | null {
    if (!claims) return null;
    const key = Object.keys(claims).find(k => /programid|program_id|program$/i.test(k));
    return key ? String(claims[key]) : null;
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
}

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------

export interface Claim {
  type: string;
  value: string;
}

export type Session = Claim[] | null;