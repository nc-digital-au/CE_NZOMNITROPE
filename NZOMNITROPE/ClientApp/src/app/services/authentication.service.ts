import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, filter, map, Observable, of, shareReplay, tap } from 'rxjs';

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
    return this._claims.find(c => c?.type === key)?.value;
  }
}

export type Session = Claim[] | null;

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _session$: Observable<Session> | null = null;
  private _currentUser: AuthenticatedUser;

  public get currentUser(): AuthenticatedUser {
    return this._currentUser;
  }

  constructor(private readonly _http: HttpClient) { }

  public getSession(ignoreCache: boolean = true) {
    if (!this._session$ || ignoreCache) {
      this._session$ = this._http.get<Session>('bff/user').pipe(
        tap(claims => {
          if (claims && claims.length) {
            this._currentUser = new AuthenticatedUser(claims);
          } else {
            this._currentUser = undefined;
          }
        }),
        catchError(err => {
          return of(ANONYMOUS);
        }),
        shareReplay(CACHE_SIZE)
      );
    }
    return this._session$;
  }

  public getIsAuthenticated(ignoreCache: boolean = false) {
    return this.getSession(ignoreCache).pipe(
      map(this.userIsAuthenticated)
    );
  }

  public getIsAnonymous(ignoreCache: boolean = false) {
    return this.getSession(ignoreCache).pipe(
      map(this.userIsAnonymous)
    );
  }

  public getUsername(ignoreCache: boolean = false) {
    return this.getSession(ignoreCache).pipe(
      filter(this.userIsAuthenticated),
      map(s => s.find(c => c.type === 'name')?.value)
    );
  }

  public getLogoutUrl(ignoreCache: boolean = false) {
    return this.getSession(ignoreCache).pipe(
      filter(this.userIsAuthenticated),
      map(s => s.find(c => c.type === 'bff:logout_url')?.value)
    );
  }

  public signOut(): void {
    if (this._currentUser) {
      this._currentUser.clearLocalStorage()
    }
  }

  private userIsAuthenticated(s: Session): s is Claim[] {
    return s !== null;
  }

  private userIsAnonymous(s: Session): s is null {
    return s === null;
  }
}