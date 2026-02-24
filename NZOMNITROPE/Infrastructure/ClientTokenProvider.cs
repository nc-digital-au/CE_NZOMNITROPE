using System.Text.Json;
using System.Net.Http.Headers;
using Microsoft.Extensions.Configuration;

namespace NZOMNITROPE.Infrastructure;

public class ClientTokenProvider
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;

    private string? _cachedToken;
    private DateTimeOffset _expiresAtUtc = DateTimeOffset.MinValue;

    public ClientTokenProvider(HttpClient http, IConfiguration config)
    {
        _http = http;
        _config = config;
    }

    public async Task<string?> GetTokenAsync(CancellationToken cancellationToken = default)
    {
        if (!string.IsNullOrEmpty(_cachedToken) && _expiresAtUtc > DateTimeOffset.UtcNow.AddSeconds(60))
        {
            return _cachedToken;
        }

        var authority = _config["OidcProxy:Oidc:Authority"]?.TrimEnd('/');
        var clientId = _config["OidcProxy:Oidc:ClientId"];
        var clientSecret = _config["OidcProxy:Oidc:ClientSecret"];
        var scope = _config["OidcProxy:Oidc:ClientCredentialsScope"]; // optional

        if (string.IsNullOrWhiteSpace(authority) || string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(clientSecret))
        {
            // Missing configuration; do not throw here—just return null so callers can proceed without client token
            return null;
        }

        var tokenEndpoint = $"{authority}/protocol/openid-connect/token";

        using var content = new FormUrlEncodedContent(
            new Dictionary<string, string>
            {
                ["grant_type"] = "client_credentials",
                ["client_id"] = clientId!,
                ["client_secret"] = clientSecret!,
            }.Concat(string.IsNullOrWhiteSpace(scope)
                ? Array.Empty<KeyValuePair<string, string>>()
                : new[] { new KeyValuePair<string, string>("scope", scope!) })
        );

        var request = new HttpRequestMessage(HttpMethod.Post, tokenEndpoint)
        {
            Content = content
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await _http.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var doc = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

        var root = doc.RootElement;
        if (!root.TryGetProperty("access_token", out var atEl))
        {
            return null;
        }

        var token = atEl.GetString();
        var expiresIn = root.TryGetProperty("expires_in", out var expEl) ? expEl.GetInt32() : 300;

        _cachedToken = token;
        _expiresAtUtc = DateTimeOffset.UtcNow.AddSeconds(Math.Max(60, expiresIn - 30));

        return _cachedToken;
    }
}

