using Duende.Bff.Yarp;
using NZOMNITROPE;
using NZOMNITROPE.ServiceRegistrations;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

Configuration config = new();
builder.Configuration.Bind("BFF", config);

// Configure forwarded headers for Azure App Service
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

builder.Services.AddAuthenticationServices(config);

// Add controllers for diagnostics
builder.Services.AddControllers();

var app = builder.Build();

// Use forwarded headers for Azure App Service
app.UseForwardedHeaders();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseBff();
app.MapBffManagementEndpoints();

if (config.Apis.Count > 0)
{
    foreach (var api in config.Apis)
    {
        var apiBuilder = app.MapRemoteBffApiEndpoint(api.LocalPath, api.RemoteUrl!);
        if (api.RequiredToken.HasValue)
        {
            apiBuilder.RequireAccessToken(api.RequiredToken.Value);
        }
    }
}

// Map controllers for diagnostics
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
