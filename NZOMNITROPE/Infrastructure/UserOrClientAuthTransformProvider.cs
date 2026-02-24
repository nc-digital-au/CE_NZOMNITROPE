using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;

namespace NZOMNITROPE.Infrastructure;

/// <summary>
/// Adds Authorization header to outbound API requests:
/// - If a user access token is present, forwards it
/// - Else, falls back to a client-credentials token from Keycloak
/// Applied only to the cluster with Id = "api".
/// </summary>
public sealed class UserOrClientAuthTransformProvider : ITransformProvider
{
    public void ValidateRoute(TransformRouteValidationContext context) { }
    public void ValidateCluster(TransformClusterValidationContext context) { }

    public void Apply(TransformBuilderContext context)
    {
        if (!string.Equals(context.Route.ClusterId, "api", StringComparison.OrdinalIgnoreCase))
            return;

        context.AddRequestTransform(async transformContext =>
        {
            // If Authorization already present (e.g., set by OidcProxy), do not overwrite
            if (transformContext.ProxyRequest.Headers.Authorization is { Parameter: { Length: > 0 } })
                return;

            var httpContext = transformContext.HttpContext;
            var userAccessToken = await httpContext.GetTokenAsync("access_token");
            if (!string.IsNullOrEmpty(userAccessToken))
            {
                transformContext.ProxyRequest.Headers.Authorization = new("Bearer", userAccessToken);
                return;
            }

            var provider = httpContext.RequestServices.GetRequiredService<ClientTokenProvider>();
            var clientToken = await provider.GetTokenAsync(httpContext.RequestAborted);
            if (!string.IsNullOrEmpty(clientToken))
            {
                transformContext.ProxyRequest.Headers.Authorization = new("Bearer", clientToken);
            }
        });
    }
}

