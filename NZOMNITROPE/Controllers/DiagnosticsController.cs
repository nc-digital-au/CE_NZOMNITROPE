using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Antiforgery;

namespace NZOMNITROPE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiagnosticsController : ControllerBase
    {
        private readonly IAntiforgery _antiforgery;
        private readonly ILogger<DiagnosticsController> _logger;

        public DiagnosticsController(IAntiforgery antiforgery, ILogger<DiagnosticsController> logger)
        {
            _antiforgery = antiforgery;
            _logger = logger;
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { 
                Status = "Healthy", 
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"),
                Timestamp = DateTime.UtcNow 
            });
        }

        [HttpGet("antiforgery-token")]
        public IActionResult GetAntiforgeryToken()
        {
            try
            {
                var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
                _logger.LogInformation("Generated antiforgery token successfully");
                
                return Ok(new { 
                    RequestToken = tokens.RequestToken,
                    HeaderName = tokens.HeaderName,
                    FormFieldName = tokens.FormFieldName,
                    HasCookie = Request.Cookies.Any(),
                    CookieNames = Request.Cookies.Keys.ToArray(),
                    Headers = Request.Headers.Select(h => new { h.Key, Value = h.Value.ToString() }).ToArray()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to generate antiforgery token");
                return StatusCode(500, new { Error = ex.Message });
            }
        }

        [HttpPost("test-antiforgery")]
        public IActionResult TestAntiforgery()
        {
            try
            {
                // This will validate the antiforgery token
                _logger.LogInformation("Antiforgery validation passed");
                return Ok(new { Message = "Antiforgery validation successful" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Antiforgery validation failed");
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
