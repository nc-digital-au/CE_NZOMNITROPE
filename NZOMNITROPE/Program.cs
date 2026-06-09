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

app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;

    if (!headers.ContainsKey("X-Content-Type-Options"))
    {
        headers["X-Content-Type-Options"] = "nosniff";
    }

    if (!headers.ContainsKey("X-Frame-Options"))
    {
        headers["X-Frame-Options"] = "DENY";
    }

    if (!headers.ContainsKey("Referrer-Policy"))
    {
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    }

    if (!headers.ContainsKey("Permissions-Policy"))
    {
        headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    }

    if (!headers.ContainsKey("Content-Security-Policy"))
    {
        headers["Content-Security-Policy"] =
            "default-src 'self'; " +
            "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "img-src 'self' data: https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com; " +
            "font-src 'self' data: https://fonts.gstatic.com; " +
            "connect-src 'self' https://www.google-analytics.com https://maps.googleapis.com https://maps.gstatic.com; " +
            "object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";
    }

    await next();
});

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseOidcProxy();

app.UseRouting();

// Map controllers for BFF endpoints (/.auth/forgot-password)
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
