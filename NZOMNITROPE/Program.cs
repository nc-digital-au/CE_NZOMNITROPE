using OidcProxy.Net.ModuleInitializers;
using OidcProxy.Net.OpenIdConnect;

var builder = WebApplication.CreateBuilder(args);

var oidcProxyConfig = builder.Configuration
    .GetSection("OidcProxy")
    .Get<OidcProxyConfig>();

builder.Services.AddOidcProxy(oidcProxyConfig!);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseOidcProxy();

app.MapFallbackToFile("/index.html");

app.Run();
