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
}

