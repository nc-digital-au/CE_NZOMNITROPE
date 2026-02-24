# Local Keycloak Setup Guide

## Prerequisites

- Docker desktop installed and running
- Port 8080 available

---

## Option 1: Start Keycloak with Docker (Recommended)

### Step 1: Start Keycloak Container

```bash
docker run --name keycloak \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  -p 8080:8080 \
  -d \
  quay.io/keycloak/keycloak:26.0.0 \
  start-dev
```

### Step 2: Verify it's Running

```bash
# Check container is up
docker ps | grep keycloak

# Verify health check
curl http://localhost:8080 -s | head -20
```

### Step 3: Access Admin Console

1. Open browser: http://localhost:8080
2. Click "Administration Console" or go to http://localhost:8080/admin/
3. Login with `admin` / `admin`

---

## Option 2: Stop/Restart Container

```bash
# Stop
docker stop keycloak

# Restart (data persists)
docker start keycloak

# Remove completely (data lost)
docker stop keycloak && docker rm keycloak
```

---

## Configure Keycloak for NZOMNITROPE

### 1. Create Realm

1. In Admin Console, hover over realm selector (top-left dropdown showing "master")
2. Click "Create Realm"
3. Name: `Sandoz-Omnipal`
4. Click "Create"

### 2. Create Client Application

1. Left sidebar → Clients
2. Click "Create client"
3. **Settings**:
   - Client ID: `Omnipal-Portal`
   - Client authentication: ON
   - Authentication flow: Standard flow enabled
   - Click "Next"
   - Click "Save"

4. **Client Details** tab (after creation):
   - Copy `Client Secret` → Use in appsettings.development.json
   - Set "Valid redirect URIs":
     ```
     http://localhost:5000/*
     http://localhost:5001/*
     http://localhost:3000/*
     ```
   - Set "Web Origins":
     ```
     http://localhost:5000
     http://localhost:5001
     http://localhost:3000
     ```
   - Click "Save"

### 3. Configure Scopes

1. Go to Client → Omnipal-Portal
2. Left sidebar → Client Scopes
3. Create new scope: `ceapi.client`
   - Type: Optional (or Required)
   - Click "Save"

### 4. Create Test User (Patient)

1. Left sidebar → Users
2. Click "Create new user"
3. **User Details**:
   - Username: `patient-test`
   - Email: `patient@test.local`
   - First Name: `John`
   - Last Name: `Patient`
   - Email verified: ON
   - On/Disabled: ON
   - Click "Create"

4. **Credentials** tab:
   - Click "Set password"
   - Password: `password123`
   - Temporary: OFF
   - Click "Set password"

5. **Role mappings** tab:
   - Choose realm role: `patient`
   - Click "Assign" (if patient role exists)
   - If patient role doesn't exist, create it first:
     - Left sidebar → Roles → Create role
     - Role name: `patient`
     - Description: `Patient user role`
     - Click "Create"
     - Then assign to user

6. **Groups** (optional):
   - Assign user to groups if using group-based access control

### 5. Create Realm Role (If Needed)

1. Left sidebar → Roles
2. Click "Create role"
3. Role name: `patient`
4. Description: `Patient user role`
5. Click "Create"

**Repeat for other roles**: `pharmacist`, `admin`, etc.

### 6. Configure Service Account (For API Calls)

1. Client: Omnipal-Portal → Service accounts roles tab
2. Assign roles needed for API calls
3. Example: Assign `ceapi.client` scope

---

## Verify Configuration

### Test Login Flow

```bash
# This should redirect to Keycloak login
curl -i http://localhost:5000/.auth/login
```

### Check Discovery Endpoint

```bash
curl http://localhost:8080/realms/Sandoz-Omnipal/.well-known/openid-configuration | jq .
```

### Verify Backend Can Reach Keycloak

In `Program.cs`, the OIDC discovery warmup line shows:
```
[startup] Waiting for OIDC discovery: http://localhost:8080/realms/Sandoz-Omnipal/.well-known/openid-configuration
```

If it times out, Keycloak is not running or not accessible.

---

## Update appsettings.development.json

```json
{
  "OidcProxy": {
    "LandingPage": "/landing",
    "Oidc": {
      "ClientId": "Omnipal-Portal",
      "ClientSecret": "{{YOUR_KEYCLOAK_CLIENT_SECRET_FROM_ADMIN_CONSOLE}}",
      "Authority": "http://localhost:8080/realms/Sandoz-Omnipal",
      "Audience": "account",
      "Scopes": ["openid", "profile", "email", "offline_access", "ceapi.client"],
      "ClientCredentialsScope": "ceapi.client"
    }
  }
}
```

---

## Start Application

```bash
# Terminal 1: Backend
cd /Users/noychavez/Documents/GitHub/CE_NZOMNITROPE
dotnet run

# Terminal 2: Frontend
cd /Users/noychavez/Documents/GitHub/CE_NZOMNITROPE/NZOMNITROPE/ClientApp
npm start
```

### Expected Startup Flow

1. Backend starts and warmups OIDC discovery
   - Logs: `[startup] Waiting for OIDC discovery...` 
   - After ~5 seconds: `[startup] OIDC discovery ready`
2. Frontend loads and shows landing page
3. Click "Login" → Redirects to Keycloak login
4. Enter credentials: `patient-test` / `password123`
5. Keycloak performs authorization code exchange
6. Redirected back with secure session cookie
7. Frontend fetches `/.auth/me` → Shows user profile
8. Guards permit access to protected routes

---

## Common Setup Issues

### Issue: "Connection refused" on localhost:8080

**Cause**: Docker container not running  
**Fix**: 
```bash
docker start keycloak
# Or restart from Option 1 above
```

### Issue: Keycloak Admin Console gives 404

**Cause**: Container still starting  
**Fix**: Wait 30 seconds, then refresh

### Issue: Client Secret mismatch error

**Cause**: appsettings.development.json has wrong secret  
**Fix**: 
1. Go to Keycloak Admin → Clients → Omnipal-Portal
2. Credentials tab → Copy exact client secret
3. Paste into appsettings.development.json
4. Restart backend (`dotnet run`)

### Issue: "redirect_uri mismatch"

**Cause**: Redirect URIs not whitelisted in Keycloak client  
**Fix**:
1. Client → Omnipal-Portal → Settings tab
2. Add to "Valid redirect URIs":
   - `http://localhost:5000/*`
   - `http://localhost:5001/*`
   - `http://localhost:3000/*`
   - Your actual backend port (check `appsettings.json`)
3. Save and retry login

---

## Cleanup

```bash
# Stop container
docker stop keycloak

# Remove image and data (WARNING: deletes all local config)
docker rm keycloak

# Or just stop without removing (data persists next time you run)
```

---

**Ready to test!** 🎉
Login credentials for testing:
- Username: `patient-test`
- Password: `password123`
