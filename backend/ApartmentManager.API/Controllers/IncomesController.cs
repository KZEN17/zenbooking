using System.Security.Claims;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApartmentManager.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class IncomesController : ControllerBase
{
    private readonly IIncomeService _incomeService;

    public IncomesController(IIncomeService incomeService)
    {
        _incomeService = incomeService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    /// <summary>
    /// Get all incomes for a specific apartment
    /// </summary>
    [HttpGet("apartment/{apartmentId}")]
    public async Task<ActionResult<IEnumerable<IncomeDto>>> GetIncomesByApartment(int apartmentId)
    {
        var userId = GetUserId();
        var incomes = await _incomeService.GetIncomesByApartmentAsync(apartmentId, userId);
        return Ok(incomes);
    }

    /// <summary>
    /// Get a specific income by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<IncomeDto>> GetIncome(int id)
    {
        var userId = GetUserId();
        var income = await _incomeService.GetIncomeByIdAsync(id, userId);

        if (income == null)
        {
            return NotFound(new { message = "Income not found" });
        }

        return Ok(income);
    }

    /// <summary>
    /// Create a new income entry
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<IncomeDto>> CreateIncome([FromBody] CreateIncomeDto dto)
    {
        try
        {
            var userId = GetUserId();
            var income = await _incomeService.CreateIncomeAsync(dto, userId);
            return CreatedAtAction(nameof(GetIncome), new { id = income.Id }, income);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    /// <summary>
    /// Update an existing income entry
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<IncomeDto>> UpdateIncome(int id, [FromBody] CreateIncomeDto dto)
    {
        var userId = GetUserId();
        var income = await _incomeService.UpdateIncomeAsync(id, dto, userId);

        if (income == null)
        {
            return NotFound(new { message = "Income not found" });
        }

        return Ok(income);
    }

    /// <summary>
    /// Delete an income entry
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteIncome(int id)
    {
        var userId = GetUserId();
        var result = await _incomeService.DeleteIncomeAsync(id, userId);

        if (!result)
        {
            return NotFound(new { message = "Income not found" });
        }

        return NoContent();
    }
}
