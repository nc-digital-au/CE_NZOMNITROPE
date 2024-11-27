using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Duende.Bff.Yarp;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.JsonWebTokens;

namespace NZOMNITROPE.ServiceRegistrations
{
    public static class AuthenticationServices
    {
        public static IServiceCollection AddAuthenticationServices(this IServiceCollection services, Configuration config)
        {
            services.AddBff(options =>
                {
                    options.ManagementBasePath = "/bff";
                }
            ).AddRemoteApis();
            services.AddUserAccessTokenHttpClient(name:"api_client", configureClient: client =>{
                client.BaseAddress = new Uri(config.Authority);
            });
            JsonWebTokenHandler.DefaultMapInboundClaims = false;
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = "ofev_cookie";
                options.DefaultChallengeScheme = "oidc";
                options.DefaultSignOutScheme = "oidc";
            })
            .AddCookie("ofev_cookie", options =>
            {
                options.Cookie.Name = "__Host-ofev";
                options.Cookie.SameSite = SameSiteMode.Strict;
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
                options.ClaimActions.Remove("aud");
                options.ClaimActions.DeleteClaim("idp");
                options.ClaimActions.MapJsonKey("role", "role");
                options.ClaimActions.MapJsonKey("program_id", "program_id");
                options.ClaimActions.MapJsonKey("registration_id", "registration_id");
                options.ClaimActions.MapJsonKey("prescriber_id", "prescriber_id");
                options.ClaimActions.MapJsonKey("prescriber_number", "prescriber_number");
                options.ClaimActions.MapJsonKey("ahpra_number", "ahpra_number");
                
                foreach (var scope in config.Scopes)
                {
                    options.Scope.Add(scope);
                }

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