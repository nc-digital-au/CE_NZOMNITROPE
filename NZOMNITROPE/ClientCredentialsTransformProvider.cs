using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Authentication;
using System.Net.Http.Headers;
using System.Text.Json;
using Yarp.ReverseProxy.Transforms;
using Yarp.ReverseProxy.Transforms.Builder;

namespace NZOMNITROPE;

/// <summary>
/// Configuration settings for client credentials flow
/// </summary>
public class ClientCredentialsSettings
{
    public string TokenEndpoint { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string Scope { get; set; } = string.Empty;
}

/// <summary>
/// Transform provider that adds client credentials token to anonymous requests.
/// This follows the same pattern as OidcProxy.Net's HttpHeaderTransformation.
/// </summary>
public class ClientCredentialsTransformProvider : ITransformProvider
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _cache;
    private readonly ClientCredentialsSettings _settings;
    private readonly ILogger<ClientCredentialsTransformProvider> _logger;
    private const string CacheKey = "ClientCredentials_AccessToken";

    public ClientCredentialsTransformProvider(
        IHttpClientFactory httpClientFactory,
        IMemoryCache cache,
        IConfiguration configuration,
        ILogger<ClientCredentialsTransformProvider> logger)
    {
        _httpClientFactory = httpClientFactory;
        _cache = cache;
        _logger = logger;
        _settings = configuration.GetSection("ClientCredentials").Get<ClientCredentialsSettings>()
            ?? throw new InvalidOperationException("ClientCredentials configuration is missing");
    }

    public void ValidateRoute(TransformRouteValidationContext context)
    {
        // No validation needed
    }

    public void ValidateCluster(TransformClusterValidationContext context)
    {
        // No validation needed
    }

    public void Apply(TransformBuilderContext context)
    {
        // Only apply to api-route, not spa-route or other routes
        if (context.Route.RouteId != "api-route")
        {
            return;
        }

        // Add a transform that ensures API requests always carry auth:
        // 1) keep existing auth header if present,
        // 2) forward user access token when available,
        // 3) fall back to client credentials token.
        context.AddRequestTransform(async transformContext =>
        {
            var httpContext = transformContext.HttpContext;

            if (transformContext.ProxyRequest.Headers.Authorization is { Parameter: { Length: > 0 } })
            {
                return;
            }

            var userAccessToken = await httpContext.GetTokenAsync("access_token");
            if (!string.IsNullOrEmpty(userAccessToken))
            {
                transformContext.ProxyRequest.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", userAccessToken);
                return;
            }

            var token = await GetClientCredentialsTokenAsync();
            if (!string.IsNullOrEmpty(token))
            {
                transformContext.ProxyRequest.Headers.Authorization =
                    new AuthenticationHeaderValue("Bearer", token);
            }
            else
            {
                _logger.LogWarning("Failed to obtain any access token for request to {Path}",
                    transformContext.HttpContext.Request.Path);
            }
        });
    }

    private async Task<string?> GetClientCredentialsTokenAsync()
    {
        // Check cache first
        if (_cache.TryGetValue(CacheKey, out string? cachedToken))
        {
            return cachedToken;
        }

        try
        {
            var client = _httpClientFactory.CreateClient();

            var tokenRequest = new Dictionary<string, string>
            {
                ["grant_type"] = "client_credentials",
                ["client_id"] = _settings.ClientId,
                ["client_secret"] = _settings.ClientSecret,
                ["scope"] = _settings.Scope
            };

            var response = await client.PostAsync(
                _settings.TokenEndpoint,
                new FormUrlEncodedContent(tokenRequest));

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonSerializer.Deserialize<TokenResponse>(content);

                if (tokenResponse != null && !string.IsNullOrEmpty(tokenResponse.access_token))
                {
                    // Cache the token with expiration (subtract 60 seconds for safety margin)
                    var expiresIn = tokenResponse.expires_in > 60
                        ? tokenResponse.expires_in - 60
                        : tokenResponse.expires_in;

                    _cache.Set(CacheKey, tokenResponse.access_token,
                        TimeSpan.FromSeconds(expiresIn));

                    _logger.LogDebug("Obtained new client credentials token, expires in {ExpiresIn}s", expiresIn);
                    return tokenResponse.access_token;
                }
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to get client credentials token: {StatusCode} - {Error}",
                    response.StatusCode, error);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error obtaining client credentials token");
        }

        return null;
    }

    private class TokenResponse
    {
        public string? access_token { get; set; }
        public string? token_type { get; set; }
        public int expires_in { get; set; }
        public string? scope { get; set; }
    }
}

