using Microsoft.AspNetCore.Mvc;

namespace NZOMNITROPE.Controllers;

/// <summary>
/// Controller for authentication-related endpoints that need server-side handling.
/// </summary>
[ApiController]
[Route(".auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Redirects to Keycloak's forgot password (reset credentials) page.
    /// This endpoint constructs the proper Keycloak URL based on the current environment's configuration.
    /// </summary>
    [HttpGet("forgot-password")]
    public IActionResult ForgotPassword()
    {
        var authority = _configuration["OidcProxy:Oidc:Authority"]?.TrimEnd('/');
        var clientId = _configuration["OidcProxy:Oidc:ClientId"];

        if (string.IsNullOrEmpty(authority) || string.IsNullOrEmpty(clientId))
        {
            return BadRequest("OIDC configuration is missing");
        }

        // Keycloak's reset credentials URL format
        var forgotPasswordUrl = $"{authority}/login-actions/reset-credentials?client_id={Uri.EscapeDataString(clientId)}";

        return Redirect(forgotPasswordUrl);
    }

    /// <summary>
    /// Clears local auth cookies and redirects to the OIDC end-session endpoint.
    /// Uses optional returnUrl query parameter or the configured PostLogoutRedirectEndpoint.
    /// </summary>
    [HttpGet("/auth/logout")]
    public IActionResult Logout([FromQuery] string? returnUrl = null)
    {
        var authority = _configuration["OidcProxy:Oidc:Authority"]?.TrimEnd('/');
        var clientId = _configuration["OidcProxy:Oidc:ClientId"];
        var postLogoutPath = _configuration["OidcProxy:Oidc:PostLogoutRedirectEndpoint"] ?? "/";

        if (string.IsNullOrEmpty(authority) || string.IsNullOrEmpty(clientId))
        {
            return BadRequest("OIDC configuration is missing");
        }

        var redirectTarget = string.IsNullOrWhiteSpace(returnUrl) ? postLogoutPath : returnUrl!;
        var appBaseUri = $"{Request.Scheme}://{Request.Host}";

        if (Uri.TryCreate(redirectTarget, UriKind.Absolute, out var absoluteRedirect))
        {
            if (!Uri.TryCreate(appBaseUri, UriKind.Absolute, out var appBaseAbsolute) ||
                Uri.Compare(absoluteRedirect, appBaseAbsolute, UriComponents.SchemeAndServer, UriFormat.Unescaped, StringComparison.OrdinalIgnoreCase) != 0)
            {
                redirectTarget = postLogoutPath;
            }
            else
            {
                redirectTarget = absoluteRedirect.PathAndQuery + absoluteRedirect.Fragment;
            }
        }

        if (!redirectTarget.StartsWith('/'))
        {
            redirectTarget = "/";
        }

        var redirectUri = $"{appBaseUri}{redirectTarget}";

        foreach (var cookieName in Request.Cookies.Keys)
        {
            Response.Cookies.Delete(cookieName);
        }

        var logoutUrl =
            $"{authority}/protocol/openid-connect/logout?client_id={Uri.EscapeDataString(clientId)}" +
            $"&post_logout_redirect_uri={Uri.EscapeDataString(redirectUri)}";

        return Redirect(logoutUrl);
    }
}

