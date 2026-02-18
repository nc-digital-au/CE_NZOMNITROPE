using Microsoft.AspNetCore.SpaServices.AngularCli;
using OidcProxy.Net.ModuleInitializers;
using OidcProxy.Net.OpenIdConnect;
using Microsoft.AspNetCore.Authentication;
using NZOMNITROPE.Infrastructure;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;
using System.Net.Http;
using System.Text.Json;
using System.Threading;

var builder = WebApplication.CreateBuilder(args);

var config = builder.Configuration
    .GetSection("OidcProxy")
    .Get<OidcProxyConfig>() ?? throw new InvalidOperationException("OidcProxy configuration is missing");

// Add OIDC proxy which configures YARP routes/clusters from appsettings
builder.Services.AddOidcProxy(config);

// Register client token provider and transform to attach Authorization header
builder.Services.AddHttpClient<ClientTokenProvider>();
builder.Services.AddSingleton<ITransformProvider, UserOrClientAuthTransformProvider>();

// Add controllers for BFF endpoints (auth, dev mock endpoints)
builder.Services.AddControllers();

builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "wwwroot";
});

var app = builder.Build();

// Tracks whether this instance has successfully loaded OIDC discovery.
// Until this is true, we should not allow users to hit /.auth/login (better UX than a 500).
int oidcDiscoveryReady = 0; // 0 = not ready, 1 = ready
var discoveryUrl = $"{config.Oidc.Authority}/.well-known/openid-configuration";

static bool IsLikelyOidcDiscoveryFailure(Exception ex)
{
	for (var current = ex; current is not null; current = current.InnerException)
	{
		if (current is HttpRequestException) return true;
		if (current is System.Net.Sockets.SocketException) return true;
		if (current is InvalidOperationException ioe &&
		    ioe.Message.Contains("Error loading discovery document", StringComparison.OrdinalIgnoreCase))
		{
			return true;
		}
	}

	return false;
}

// Background warm-up: keep retrying OIDC discovery until it is ready.
// This avoids blocking startup (Keycloak outage shouldn't prevent the site from starting),
// and pairs well with an App Service Health Check path (/_health/ready).
var warmupLogger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("OidcDiscoveryWarmup");
var warmupCts = new CancellationTokenSource();
app.Lifetime.ApplicationStopping.Register(() =>
{
    try { warmupCts.Cancel(); }
    catch { /* ignore */ }
});

_ = Task.Run(async () =>
{
    var httpClientFactory = app.Services.GetRequiredService<IHttpClientFactory>();
    var attempt = 0;
	var consecutiveFailures = 0;

	// Keep monitoring discovery for the lifetime of the app.
	// If Keycloak goes down after we were previously ready, flip back to "not ready"
	// so the SPA warmup flow can keep users on a friendly loading UX.
	while (!warmupCts.IsCancellationRequested)
    {
        attempt++;
        try
        {
            using var client = httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(10);

            var json = await client.GetStringAsync(discoveryUrl, warmupCts.Token);
            using var doc = JsonDocument.Parse(json);

            // The login crash happens when authorization_endpoint is null/empty.
            if (doc.RootElement.TryGetProperty("authorization_endpoint", out var authEndpoint) &&
                !string.IsNullOrWhiteSpace(authEndpoint.GetString()))
            {
				var previous = Interlocked.Exchange(ref oidcDiscoveryReady, 1);
				consecutiveFailures = 0;
				if (previous == 0)
				{
					warmupLogger.LogInformation(
					    "OIDC discovery is ready (attempt {Attempt}). authorization_endpoint present. DiscoveryUrl={DiscoveryUrl}",
					    attempt,
					    discoveryUrl);
				}
            }

            warmupLogger.LogWarning(
                "OIDC discovery fetched but missing authorization_endpoint (attempt {Attempt}). DiscoveryUrl={DiscoveryUrl}",
                attempt,
                discoveryUrl);
        }
        catch (OperationCanceledException) when (warmupCts.IsCancellationRequested)
        {
            break;
        }
        catch (Exception ex)
        {
			consecutiveFailures++;
			if (Volatile.Read(ref oidcDiscoveryReady) == 1 && consecutiveFailures >= 2)
			{
				Volatile.Write(ref oidcDiscoveryReady, 0);
				warmupLogger.LogWarning(ex,
				    "OIDC discovery became unavailable; marking instance not ready. DiscoveryUrl={DiscoveryUrl}",
				    discoveryUrl);
			}

            warmupLogger.LogWarning(ex,
                "OIDC discovery warm-up failed (attempt {Attempt}). DiscoveryUrl={DiscoveryUrl}",
                attempt,
                discoveryUrl);
        }

		var ready = Volatile.Read(ref oidcDiscoveryReady) == 1;
		// If not ready, use exponential backoff up to 30s.
		// If ready, poll less aggressively.
		var delaySeconds = ready
			? 15
			: Math.Min(30, Math.Pow(2, Math.Min(attempt, 5)));
        try
        {
            await Task.Delay(TimeSpan.FromSeconds(delaySeconds), warmupCts.Token);
        }
        catch (OperationCanceledException)
        {
            break;
        }
    }
});

app.UseDefaultFiles();
app.UseStaticFiles();

if (!app.Environment.IsDevelopment())
{
    app.UseSpaStaticFiles();
}

// OIDC Proxy configures session, authentication, and YARP reverse proxy for /api/* routes
// Guard login until OIDC discovery is known-ready on this instance.
// This prevents 500s and provides a better UX while the app/keycloak is warming up.
app.Use(async (context, next) =>
{
	var isLogin = context.Request.Path.Equals(new PathString("/.auth/login"));
	if (!isLogin)
	{
		await next();
		return;
	}

	// If a browser hits /.auth/login before discovery is ready, redirect them to the SPA warmup page
	// instead of showing a 503 error page. Non-browser clients still receive 503 + Retry-After.
	if (Volatile.Read(ref oidcDiscoveryReady) == 0)
	{
		context.Response.Headers["Cache-Control"] = "no-store";

		var accept = context.Request.Headers.Accept.ToString();
		if (accept.Contains("text/html", StringComparison.OrdinalIgnoreCase))
		{
			context.Response.Redirect("/authentication/start-login");
			return;
		}

		context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
		context.Response.Headers["Retry-After"] = "5";
		context.Response.ContentType = "text/plain; charset=utf-8";
		await context.Response.WriteAsync("Login service is warming up. Please retry in a few seconds.");
		return;
	}

	try
	{
		await next();
	}
	catch (Exception ex) when (IsLikelyOidcDiscoveryFailure(ex))
	{
		// Keycloak can go down after we were previously ready.
		// Avoid an unhandled exception page by routing users back to the SPA warmup experience.
		Volatile.Write(ref oidcDiscoveryReady, 0);
		warmupLogger.LogWarning(ex,
			"OIDC discovery failed during /.auth/login; marking instance not ready and redirecting to SPA warmup. DiscoveryUrl={DiscoveryUrl}",
			discoveryUrl);

		if (context.Response.HasStarted)
		{
			throw;
		}

		context.Response.Headers["Cache-Control"] = "no-store";

		var accept = context.Request.Headers.Accept.ToString();
		if (accept.Contains("text/html", StringComparison.OrdinalIgnoreCase))
		{
			context.Response.Redirect("/authentication/start-login");
			return;
		}

		context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
		context.Response.Headers["Retry-After"] = "5";
		context.Response.ContentType = "text/plain; charset=utf-8";
		await context.Response.WriteAsync("Login service is warming up. Please retry in a few seconds.");
	}
});

app.UseOidcProxy();

app.UseRouting();

// Map controllers for BFF endpoints (/.bff/*, /.auth/forgot-password)
// These routes don't conflict with YARP since YARP only handles /api/*
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapGet("/_health/ready", async context =>
    {
		context.Response.Headers["Cache-Control"] = "no-store";

		if (Volatile.Read(ref oidcDiscoveryReady) == 1)
        {
            context.Response.StatusCode = StatusCodes.Status200OK;
            await context.Response.WriteAsync("ready");
            return;
        }

        context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
		context.Response.Headers["Retry-After"] = "5";
        await context.Response.WriteAsync("warming up");
    });
});

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