using Duende.Bff.Yarp;
using NZOMNITROPE;
using NZOMNITROPE.ServiceRegistrations;

var builder = WebApplication.CreateBuilder(args);

Configuration config = new();
builder.Configuration.Bind("BFF", config);

builder.Services.AddAuthenticationServices(config);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseBff();
app.MapBffManagementEndpoints();

if (config.Apis.Any())
{
    foreach (var api in config.Apis)
    {
        var apiBuilder = app.MapRemoteBffApiEndpoint(api.LocalPath, api.RemoteUrl!);
        if (api.RequiredToken.HasValue)
        {
            apiBuilder.RequireAccessToken(api.RequiredToken.Value);
        }
    }
};

app.MapFallbackToFile("/index.html");

app.Run();