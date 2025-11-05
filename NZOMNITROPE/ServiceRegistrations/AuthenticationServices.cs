using Duende.Bff.Yarp;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.JsonWebTokens;

namespace NZOMNITROPE.ServiceRegistrations
{
    public static class AuthenticationServices
    {
        public static IServiceCollection AddAuthenticationServices(this IServiceCollection services, Configuration config)
        {
            // Get environment to handle Azure-specific configurations
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
            var isProduction = environment.Equals("Production", StringComparison.OrdinalIgnoreCase);

            // Use different cookie name for production if __Host- prefix causes issues
            var cookieName = isProduction ? "omnitrope-prod" : "__Host-omnitrope";

            services.AddBff(options =>
                {
                    options.ManagementBasePath = "/bff";
                    // Configure anti-forgery for production
                    options.AntiForgeryHeaderName = "X-CSRF";
                    options.AntiForgeryHeaderValue = "1";
                }
            ).AddRemoteApis();
            services.AddUserAccessTokenHttpClient(name:"api_client", configureClient: client =>{
                client.BaseAddress = new Uri(config.Authority ?? throw new InvalidOperationException("Authority configuration is required"));
            });
            JsonWebTokenHandler.DefaultMapInboundClaims = false;
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "omnitrope_cookie";
                options.DefaultChallengeScheme = "oidc";
                options.DefaultSignOutScheme = "oidc";
            })
            .AddCookie("omnitrope_cookie", options =>
            {
                options.Cookie.Name = cookieName;
                options.Cookie.SameSite = SameSiteMode.Strict;
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.HttpOnly = true;
                options.Cookie.Path = "/";
                // Ensure cookie works with Azure App Service
                options.Cookie.IsEssential = true;

                // Additional production-specific settings
                if (isProduction)
                {
                    options.Cookie.Domain = null; // Let Azure handle domain
                    options.SlidingExpiration = true;
                    options.ExpireTimeSpan = TimeSpan.FromHours(8);
                }
            })
            .AddOpenIdConnect("oidc", options =>
            {
                options.Authority = config.Authority;
                options.ClientId = config.ClientId;
                options.ClientSecret = config.ClientSecret;

                options.ResponseType = "code";
                options.ResponseMode = "query";
                options.MapInboundClaims = false;
                options.GetClaimsFromUserInfoEndpoint = true;
                options.SaveTokens = true;
                options.Scope.Clear();
                 foreach (var scope in config.Scopes)
                {
                    options.Scope.Add(scope);
                }
                options.ClaimActions.Remove("aud");
                options.ClaimActions.DeleteClaim("idp");
                options.ClaimActions.MapJsonKey("role", "role");
                options.ClaimActions.MapJsonKey("program_id", "program_id");
                options.ClaimActions.MapJsonKey("registration_id", "registration_id");
                options.ClaimActions.MapJsonKey("prescriber_id", "prescriber_id");
                options.ClaimActions.MapJsonKey("prescriber_number", "prescriber_number");
                options.ClaimActions.MapJsonKey("ahpra_number", "ahpra_number");
                options.ClaimActions.MapJsonKey("registration_status", "registration_status");

                options.TokenValidationParameters = new()
                {
                    NameClaimType = "name",
                    RoleClaimType = "role"
                };
            });

            return services;
        }
    }
}