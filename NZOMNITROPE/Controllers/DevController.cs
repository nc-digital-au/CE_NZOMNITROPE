using Microsoft.AspNetCore.Mvc;

namespace NZOMNITROPE.Controllers;

/// <summary>
/// Development-only controller for mock endpoints.
/// These endpoints allow frontend development without requiring the external API.
/// Only available in Development environment.
/// Uses /.bff/ route prefix to avoid conflict with YARP reverse proxy.
/// </summary>
[ApiController]
[Route(".bff")]
public class DevController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<DevController> _logger;

    public DevController(IWebHostEnvironment environment, ILogger<DevController> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    /// <summary>
    /// Returns mock program registrations for development.
    /// This allows the frontend to work without the external API running.
    /// Route: /.bff/my/registrations
    /// </summary>
    [HttpGet("my/registrations")]
    public IActionResult GetMyRegistrations()
    {
	        if (!_environment.IsDevelopment())
	        {
	            _logger.LogWarning("Attempt to access dev mock endpoint in non-development environment");
	            return NotFound();
	        }

	        // DEV NOTE:
	        // We previously returned hard-coded mock registrations here (e.g. Erelzi only),
	        // which overrode the real program registrations coming from the external API
	        // and caused incorrect behaviour in the Program Hub / Available Programs UI.
	        //
	        // To ensure the frontend always uses the actual registrations for the logged-in user,
	        // this dev endpoint now intentionally returns 404 so that the Angular
	        // ProgramCatalogService falls back to UserServiceProxy.getMyRegistrations().
	        _logger.LogInformation("Dev mock /my/registrations endpoint disabled; falling back to external API.");
	        return NotFound();
    }

    private string? GetUserRoleFromClaims()
    {
        if (User?.Identity?.IsAuthenticated != true)
            return null;

        // Try to extract role from various claim types that Keycloak might use
        var roleClaims = new[] { "role", "roles", "realm_access", "resource_access" };
        
        foreach (var claimType in roleClaims)
        {
            var claim = User.Claims.FirstOrDefault(c => c.Type.Equals(claimType, StringComparison.OrdinalIgnoreCase));
            if (claim != null)
            {
                var value = claim.Value.ToLowerInvariant();
                if (value.Contains("patient")) return "patient";
                if (value.Contains("prescriber")) return "prescriber";
                if (value.Contains("pharmacist")) return "pharmacist";
            }
        }

        // Also check for standard role claim
        var standardRole = User.Claims.FirstOrDefault(c => 
            c.Type == System.Security.Claims.ClaimTypes.Role ||
            c.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
        
        if (standardRole != null)
        {
            var value = standardRole.Value.ToLowerInvariant();
            if (value.Contains("patient")) return "patient";
            if (value.Contains("prescriber")) return "prescriber";
            if (value.Contains("pharmacist")) return "pharmacist";
        }

        return null;
    }

}

