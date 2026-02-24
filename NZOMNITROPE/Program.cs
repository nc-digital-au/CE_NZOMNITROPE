using NZOMNITROPE;
using OidcProxy.Net.ModuleInitializers;
using OidcProxy.Net.OpenIdConnect;
using Yarp.ReverseProxy.Transforms.Builder;

var builder = WebApplication.CreateBuilder(args);

// Load OidcProxy configuration with better error handling
var oidcProxySection = builder.Configuration.GetSection("OidcProxy");
if (!oidcProxySection.Exists())
{
    throw new InvalidOperationException("OidcProxy configuration section is missing from appsettings");
}

var config = oidcProxySection.Get<OidcProxyConfig>();
if (config == null)
{
    throw new InvalidOperationException("Failed to deserialize OidcProxy configuration. Check appsettings structure.");
}

if (config.Oidc == null || string.IsNullOrEmpty(config.Oidc.Authority))
{
    throw new InvalidOperationException("OidcProxy.Oidc configuration is missing or invalid");
}

// Add required services for client credentials flow
builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();

// Register the transform provider for client credentials
// This follows the same pattern as OidcProxy.Net's HttpHeaderTransformation
builder.Services.AddSingleton<ITransformProvider, ClientCredentialsTransformProvider>();


builder.Services.AddOidcProxy(config!);

// Add controllers for BFF endpoints (auth endpoints like forgot-password)
builder.Services.AddControllers();

var app = builder.Build();

// Use forwarded headers for Azure App Service
app.UseForwardedHeaders();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseOidcProxy();

app.UseRouting();

// Map controllers for BFF endpoints (/.auth/forgot-password)
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
