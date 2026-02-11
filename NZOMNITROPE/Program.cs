using OidcProxy.Net.ModuleInitializers;
using OidcProxy.Net.OpenIdConnect;

var builder = WebApplication.CreateBuilder(args);

var oidcProxyConfig = builder.Configuration
    .GetSection("OidcProxy")
    .Get<OidcProxyConfig>();

builder.Services.AddOidcProxy(oidcProxyConfig!);

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
