using Microsoft.AspNetCore.SpaServices.AngularCli;
using OidcProxy.Net.ModuleInitializers;
using OidcProxy.Net.OpenIdConnect;

var builder = WebApplication.CreateBuilder(args);

var config = builder.Configuration
    .GetSection("OidcProxy")
    .Get<OidcProxyConfig>();

builder.Services.AddOidcProxy(config);
builder.Services.AddHttpContextAccessor();

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot";
});            

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (!app.Environment.IsDevelopment())
{
    app.UseSpaStaticFiles();
}

app.UseOidcProxy();
app.UseRouting();

// // Add API endpoints that forward tokens
// app.MapPost("/api/{*path}", async (HttpContext context, IHttpClientFactory httpClientFactory) =>
// {
//     var accessToken = context.Request.Headers["Authorization"].FirstOrDefault()?.Replace("Bearer ", "");
    
//     var client = httpClientFactory.CreateClient();
//     client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
    
//     var externalApiUrl = $"https://localhost:5144/api/{context.Request.RouteValues["path"]}";
//     var response = await client.PostAsync(externalApiUrl, new StreamContent(context.Request.Body));
    
//     return Results.Stream(await response.Content.ReadAsStreamAsync(), response.Content.Headers.ContentType?.ToString());
// });

app.UseEndpoints(_ => { });

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";

    if (app.Environment.IsDevelopment())
    {
        spa.UseAngularCliServer(npmScript: "start");
        
        // or use:
        // spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
    }
});

app.Run();
