import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, Observable, of, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';

const ANONYMOUS: Session = null;
const CACHE_SIZE = 1;

export interface Claim {
  type: string;
  value: string;
}

export class AuthenticatedUser {
  prescriberId: string;
  prescriberNumber: string;
  ahpraNumber: string;

  private _claims: Claim[] = [];
  private _lsKey = {
    prescriberNumber: 'prescriber.number',
  };

  constructor(claims: Claim[] = []) {
    this._claims = claims;
    this.initializeProps();
  }

  storePrescriberNumber(value: string): void {
    if (value && value !== 'undefined' && value !== 'null') {
      localStorage.setItem(this._lsKey.prescriberNumber, value);
      this.initializeProps();
    }
  }

  clearLocalStorage(): void {
    localStorage.removeItem(this._lsKey.prescriberNumber);
  }

  private initializeProps(): void {
    this.prescriberId = this.readSessionValue('prescriber_id');
    this.ahpraNumber = this.readSessionValue('ahpra_number');

    let prescriberNumber = this.readSessionValue('prescriber_number');
    if (prescriberNumber && prescriberNumber !== 'undefined' && prescriberNumber !== 'null') {
      localStorage.setItem(this._lsKey.prescriberNumber, prescriberNumber);
    } else {
      const lsPrescriberNumber = localStorage.getItem(this._lsKey.prescriberNumber);
      if (lsPrescriberNumber) {
        prescriberNumber = lsPrescriberNumber;
      }
    }
    this.prescriberNumber = prescriberNumber;
  }

  private readSessionValue(key: string): string {
    return this._claims.find(c => c?.type === key)?.value || '';
  }
}

export type Session = Claim[] | null;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _session$: Observable<Session> | null = null;
  private _currentUser: AuthenticatedUser;
  private _roles: string[] = [];
  private readonly sessionEndpoint = environment.production ? '/.auth/me' : '/.bff/auth-debug';

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

  public get roles(): string[] {
    return this._roles;
  }

  constructor(private readonly _http: HttpClient) { }

  public getLogoutUrl(): Observable<string> {
    return of('/.auth/end-session');
  }

  public getSession(ignoreCache: boolean = true): Observable<Session> {
    if (!this._session$ || ignoreCache) {
      this._session$ = this._http.get<unknown>(this.sessionEndpoint).pipe(
        map(user => {
          if (!user) {
            this._roles = [];
            return ANONYMOUS;
          }

          const claims = this.extractClaimsFromSessionResponse(user);
          const isAuthenticated = this.extractIsAuthenticatedFromSessionResponse(user);

          if (isAuthenticated === false) {
            this._roles = [];
            return ANONYMOUS;
          }

          this._roles = this.extractRolesFromSession(user, claims);
          this._currentUser = new AuthenticatedUser(claims);
          return claims;
        }),
        catchError(() => {
          this._roles = [];
          return of(ANONYMOUS);
        }),
        shareReplay(CACHE_SIZE)
      );
    }

    return this._session$;
  }

  public getIsAuthenticated(ignoreCache: boolean = false): Observable<boolean> {
    return this.getSession(ignoreCache).pipe(
      map(s => this.userIsAuthenticated(s))
    );
  }

  public getIsAnonymous(ignoreCache: boolean = false): Observable<boolean> {
    return this.getSession(ignoreCache).pipe(
      map(s => !this.userIsAuthenticated(s))
    );
  }

  public getUsername(ignoreCache: boolean = false): Observable<string | undefined> {
    return this.getSession(ignoreCache).pipe(
      filter((s): s is Claim[] => this.userIsAuthenticated(s)),
      map(s => s.find(c => c.type === 'name')?.value)
    );
  }

  public getAccountId(ignoreCache: boolean = false): Observable<string | undefined> {
    return this.getSession(ignoreCache).pipe(
      filter((s): s is Claim[] => this.userIsAuthenticated(s)),
      map(s => this.findClaimValue(s, 'AccountId'))
    );
  }

  public signOut(): void {
    if (this._currentUser) {
      this._currentUser.clearLocalStorage();
    }
  }

  private userIsAuthenticated(s: Session): s is Claim[] {
    return s !== null;
  }

  private findClaimValue(claims: Claim[], claimType: string): string | undefined {
    return claims.find(c => c.type.localeCompare(claimType, undefined, { sensitivity: 'accent' }) === 0)?.value;
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

  private extractClaimsFromSessionResponse(user: unknown): Claim[] {
    if (user && typeof user === 'object' && !Array.isArray(user)) {
      const payload = user as Record<string, unknown>;
      const nestedClaims = payload['claims'];
      if (Array.isArray(nestedClaims)) {
        return nestedClaims
          .filter(claim => typeof claim === 'object' && claim !== null && typeof (claim as Record<string, unknown>)['type'] === 'string')
          .map(claim => {
            const record = claim as Record<string, unknown>;
            return {
              type: String(record['type']),
              value: record['value'] != null ? String(record['value']) : ''
            };
          });
      }
    }

    return this.mapUserToClaims(user);
  }

  private extractIsAuthenticatedFromSessionResponse(user: unknown): boolean | undefined {
    if (user && typeof user === 'object' && !Array.isArray(user)) {
      const payload = user as Record<string, unknown>;
      if (typeof payload['isAuthenticated'] === 'boolean') {
        return payload['isAuthenticated'];
      }
    }

    return undefined;
  }

  private extractRolesFromSession(user: unknown, claims: Claim[]): string[] {
    const roles = new Set<string>();

    claims.forEach(claim => {
      const claimType = claim.type.toLowerCase();
      const isDirectRoleClaim =
        claimType === 'role' ||
        claimType === 'roles' ||
        claimType === 'groups' ||
        claimType.endsWith('/role') ||
        claimType.includes('claims/role');

      if (isDirectRoleClaim) {
        this.addRolesFromProperty(claim.value, roles);
      }

      if (claimType === 'realm_access') {
        this.parseKeycloakRealmAccess(claim.value, roles);
      }

      if (claimType === 'resource_access') {
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