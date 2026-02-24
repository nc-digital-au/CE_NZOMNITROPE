# Keycloak + OidcProxy.Net Implementation Guide

## Overview

This application uses **Keycloak** (via **OidcProxy.Net BFF**) for patient authentication. The implementation consists of:

1. **Backend BFF (Backend for Frontend)**: ASP.NET Core with OidcProxy.Net handling OIDC flows
2. **Frontend**: Angular signals-based authentication service with Keycloak integration
3. **Role-based access control** via guards and computed signals

---

## Architecture

### Backend Flow

```
Browser Request
    ↓
OidcProxy.Net Middleware
    ├─ /.auth/login → Redirects to Keycloak
    ├─ /.auth/logout → Revokes session + redirects
    ├─ /.auth/me → Returns authenticated user claims (JWT)
    ├─ /.auth/token → Returns access token for API calls
    └─ /api/* → YARP reverse proxy with Authorization header
    |
    ├─ UserOrClientAuthTransformProvider
    │   ├─ If user has token: Forward user token
    │   └─ If no user token: Use client credentials
    │
    └─ Keycloak
```

### Frontend Flow

```
User Opens App
    ↓
authenticatedGuard / unauthenticatedGuard
    ↓
AuthenticationService.session: Signal<Session>
    ├─ Fetches /.auth/me (with auto-retry on 401/403)
    ├─ Emits Observable<Session> via getSession()
    └─ Derives computed signals:
       ├─ isAuthenticated: boolean
       ├─ isAnonymous: boolean
       ├─ username: string | null
       ├─ roles: string[]
       └─ claims: Record<string, unknown>
```

---

## Configuration

### Development Settings (appsettings.development.json)

```json
{
  "OidcProxy": {
    "LandingPage": "/landing",
    "Oidc": {
      "ClientId": "Omnipal-Portal",
      "ClientSecret": "twS0kdy8za1vzcvmCucRCCPC1E7tU2Zn",
      "Authority": "http://localhost:8080/realms/Sandoz-Omnipal",
      "Audience": "account",
      "Scopes": ["openid", "profile", "email", "offline_access", "ceapi.client"],
      "ClientCredentialsScope": "ceapi.client",
      "ResponseType": "code",
      "ResponseMode": "query",
      "SaveTokens": true,
      "GetClaimsFromUserInfoEndpoint": true
    }
  }
}
```

### Key Configuration Properties

| Property | Purpose |
|----------|---------|
| `ClientId` | Keycloak application ID |
| `ClientSecret` | Keycloak app secret (for server-to-server auth) |
| `Authority` | Keycloak realm URL |
| `Scopes` | OAuth2 scopes to request (profile, email, custom scopes) |
| `ClientCredentialsScope` | Scope for client credentials flow (API-to-API) |

---

## AuthenticationService API

### Observable Methods (for Guards/Components)

```typescript
// Call in route guards or components that need to subscribe
authService.getIsAuthenticated(): Observable<boolean>
authService.getIsAnonymous(): Observable<boolean>
authService.getUsername(): Observable<string | null>
authService.getSession(ignoreCache?: boolean): Observable<Session>
```

### Computed Signals (for Real-time UI Updates)

```typescript
// Use in templates with async pipe or access in components
authService.isAuthenticated: Signal<boolean>
authService.isAnonymous: Signal<boolean>
authService.username: Signal<string | null>
authService.email: Signal<string | null>
authService.rolesFromClaims: Signal<string[]>
authService.claims: Signal<Record<string, unknown> | null>
```

### Action Methods

```typescript
// Redirect to Keycloak login
authService.login(returnUrl?: string): void

// Clear session and redirect to logout endpoint
authService.logout(): void
authService.signOut(): void  // Alias for logout()

// Redirect to Keycloak forgot password flow
authService.forgotPassword(): void
```

---

## Route Guards

### authenticatedGuard
Protects routes that require authentication. Automatically redirects unauthenticated users to landing page.

```typescript
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authenticatedGuard]  // ✓ Requires authentication
  }
];
```

### unauthenticatedGuard
Protects public routes. Redirects authenticated users away from login/register pages.

```typescript
export const routes: Routes = [
  {
    path: 'authentication',
    canActivate: [unauthenticatedGuard],  // ✓ Only for logged-out users
    children: [
      { path: 'login', component: LoginComponent }
    ]
  }
];
```

---

## Claim Extraction

### Keycloak Claim Types

The authentication service extracts roles from multiple Keycloak claim structures:

1. **Direct role claims**
   ```json
   { "role": "patient", "roles": ["patient"] }
   ```

2. **Realm roles** (realm_access.roles)
   ```json
   { "realm_access": { "roles": ["patient", "default-roles-..."] } }
   ```

3. **Resource/client roles** (resource_access.[client].roles)
   ```json
   { "resource_access": { "Omnipal-Portal": { "roles": ["patient"] } } }
   ```

### Role Filtering

System roles are automatically excluded:
```typescript
const systemRoles = [
  'offline_access',
  'uma_authorization',
  'default-roles-commercial-eyes',
  'admin'
];
```

### Custom Claim Extraction

```typescript
// Extract programId, accountId, etc.
authService.programIdFromClaims: Signal<string | null>
authService.accountId: Signal<string | null>
```

---

## User vs. Client Credentials Flow

### User Token Flow (Interactive Login)

1. User clicks "Login"
2. Redirected to `/.auth/login`
3. OidcProxy.Net → Keycloak authorization endpoint
4. User enters credentials
5. Keycloak redirects back with authorization code
6. OidcProxy.Net exchanges code for tokens
7. Tokens stored in **secure, HTTP-only session cookies**
8. Frontend fetches `/.auth/me` → receives user claims

### Client Credentials Flow (Service-to-Service)

When backend makes API calls **without** a user-authenticated token:

```csharp
// UserOrClientAuthTransformProvider.cs
// If user has token: Authorization: Bearer <user-token>
// Else: Fallback to client credentials token
// - Requests token from Keycloak using ClientId + ClientSecret
// - Token cached, reused until expiry
```

---

## Development vs. Production

### Environment File Structure

```typescript
// environment.ts (development)
export const environment = {
  production: false,
  tenantId: '2b8753ae-e823-4033-aef7-c4e102b463a1',
  programId: '2b8753ae-e823-4033-aef7-c4e102b463a1',
  // ...
};

// environment.prod.ts (production)
export const environment = {
  production: true,
  tenantId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  programId: 'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
  // ...
};
```

### Development Fallback

In development, if no roles are detected from Keycloak, the auth service defaults to 'patient' role for testing:

```typescript
const DEV_FALLBACK_ROLE: 'patient' | 'pharmacist' | null = 'patient';

// Set to null to require actual Keycloak roles
// Or set to 'pharmacist' to test prescriber features
```

---

## Common Patterns

### 1. Template with Observable Subscription

```html
<!-- home.component.html -->
<div *ngIf="(authenticated$ | async) as isAuth">
  <button *ngIf="!isAuth" (click)="onLogin()">Login</button>
  <button *ngIf="isAuth" (click)="onLogout()">Logout</button>
</div>
```

```typescript
// home.component.ts
export class HomeComponent {
  public authenticated$ = this.auth.getIsAuthenticated();
  
  constructor(private auth: AuthenticationService) {}
  
  onLogin() {
    this.auth.login(this.router.url);  // Return to current page after login
  }
  
  onLogout() {
    this.auth.logout();  // Redirects to landing page
  }
}
```

### 2. Guard Implementation

```typescript
export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  
  return authService.getIsAuthenticated().pipe(
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/authentication/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
};
```

### 3. Role-Based Navigation

```typescript
// In a component
export class NavComponent {
  public isPatient = computed(() => {
    const roles = this.auth.rolesFromClaims();
    return roles.includes('patient');
  });
  
  public isPharmacist = computed(() => {
    const roles = this.auth.rolesFromClaims();
    return roles.includes('pharmacist');
  });
}
```

```html
<!-- Template -->
<a *ngIf="isPatient()" href="/order">Order Device</a>
<a *ngIf="isPharmacist()" href="/prescriptions">Manage Prescriptions</a>
```

---

## Troubleshooting

### Issue: 401 Unauthorized After Login

**Cause**: User token expired or invalid  
**Fix**: 
- Check Keycloak is running: `http://localhost:8080`
- Check token expiry in `appsettings.development.json`
- Clear browser cookies and re-login

### Issue: CORS Errors Calling /api/*

**Cause**: YARP reverse proxy not forwarding Authorization header  
**Fix**:
- Verify `UserOrClientAuthTransformProvider` is registered in `Program.cs`
- Check `/api*` routes match YARP cluster configuration
- Verify `ClientId` and `ClientSecret` are correct

### Issue: Role Claims Not Appearing

**Cause**: Keycloak scopes not configured or GetClaimsFromUserInfoEndpoint disabled  
**Fix**:
- In `appsettings.development.json`, ensure:
  ```json
  "Scopes": ["openid", "profile", "email", "offline_access", "ceapi.client"],
  "GetClaimsFromUserInfoEndpoint": true
  ```
- Check user has assigned roles in Keycloak realm/client

### Issue: "Login service is warming up" on first visit

**Cause**: OidcProxy discovery not yet ready  
**Fix**:
- This is expected on cold start; wait 5-15 seconds
- Page auto-retries discovery in the background
- Check `/_health/ready` endpoint shows `ready`

---

## Testing

### Unit Test Template

```typescript
describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthenticationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should extract patient role from Keycloak JWT', (done) => {
    const mockSession = [
      { type: 'name', value: 'John Doe' },
      { type: 'resource_access', value: '{"Omnipal-Portal":{"roles":["patient"]}}' }
    ];

    service.getSession(true).subscribe(session => {
      expect(service.rolesFromClaims()).toContain('patient');
      done();
    });

    const req = httpMock.expectOne('/.auth/me');
    req.flush(mockSession);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

---

## Next Steps

### For Production Deployment

1. **Update appsettings.production.json** with production Keycloak credentials
2. **Whitelist redirect URIs** in Keycloak client configuration:
   - `https://your-production-domain/`
   - `https://your-production-domain/authentication/callback`
3. **Set `production: true`** in environment.prod.ts
4. **Test end-to-end** with production Keycloak instance
5. **Monitor** `/_health/ready` endpoint for uptime visibility

### For Custom Role Mapping

If you have custom claim types beyond standard Keycloak roles:

1. Add extraction logic in `AuthenticationService.extractRolesFromSession()`
2. Example:
   ```typescript
   // Extract from custom claim
   const customRoleClaim = claims.find(c => c.type === 'custom_roles');
   if (customRoleClaim?.value) {
     const roles = customRoleClaim.value.split(',');
     roles.forEach(r => roles.add(r.trim().toLowerCase()));
   }
   ```

---

## References

- [OidcProxy.Net Documentation](https://github.com/WildGums/OidcProxy.Net)
- [Keycloak Administration Guide](https://www.keycloak.org/documentation.html)
- [Angular Signals Documentation](https://angular.io/guide/signals)
- [RxJS Guide](https://rxjs.dev/)

---

**Last Updated**: February 18, 2026  
**Status**: Production Ready ✓
