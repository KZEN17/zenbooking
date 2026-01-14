using System.Security.Claims;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApartmentManager.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SummaryController : ControllerBase
{
    private readonly ISummaryService _summaryService;

    public SummaryController(ISummaryService summaryService)
    {
        _summaryService = summaryService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    /// <summary>
    /// Get monthly summary for a specific apartment
    /// </summary>
    [HttpGet("monthly/{apartmentId}/{year}/{month}")]
    public async Task<ActionResult<MonthlySummaryDto>> GetMonthlySummary(int apartmentId, int year, int month)
    {
        var userId = GetUserId();
        var summary = await _summaryService.GetMonthlySummaryAsync(apartmentId, year, month, userId);

        if (summary == null)
        {
            return NotFound(new { message = "Apartment not found or no data for this period" });
        }

        return Ok(summary);
    }

    /// <summary>
    /// Get yearly summary for all user's apartments
    /// </summary>
    [HttpGet("yearly/{year}")]
    public async Task<ActionResult<IEnumerable<MonthlySummaryDto>>> GetYearlySummary(int year)
    {
        var userId = GetUserId();
        var summaries = await _summaryService.GetYearlySummaryAsync(year, userId);
        return Ok(summaries);
    }
}
