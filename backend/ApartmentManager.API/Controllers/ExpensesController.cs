using System.Security.Claims;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApartmentManager.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly IExpenseService _expenseService;

    public ExpensesController(IExpenseService expenseService)
    {
        _expenseService = expenseService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    /// <summary>
    /// Get all expenses for a specific apartment
    /// </summary>
    [HttpGet("apartment/{apartmentId}")]
    public async Task<ActionResult<IEnumerable<ExpenseDto>>> GetExpensesByApartment(int apartmentId)
    {
        var userId = GetUserId();
        var expenses = await _expenseService.GetExpensesByApartmentAsync(apartmentId, userId);
        return Ok(expenses);
    }

    /// <summary>
    /// Get a specific expense by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ExpenseDto>> GetExpense(int id)
    {
        var userId = GetUserId();
        var expense = await _expenseService.GetExpenseByIdAsync(id, userId);

        if (expense == null)
        {
            return NotFound(new { message = "Expense not found" });
        }

        return Ok(expense);
    }

    /// <summary>
    /// Create a new expense entry
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ExpenseDto>> CreateExpense([FromBody] CreateExpenseDto dto)
    {
        try
        {
            var userId = GetUserId();
            var expense = await _expenseService.CreateExpenseAsync(dto, userId);
            return CreatedAtAction(nameof(GetExpense), new { id = expense.Id }, expense);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
    }

    /// <summary>
    /// Update an existing expense entry
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ExpenseDto>> UpdateExpense(int id, [FromBody] CreateExpenseDto dto)
    {
        var userId = GetUserId();
        var expense = await _expenseService.UpdateExpenseAsync(id, dto, userId);

        if (expense == null)
        {
            return NotFound(new { message = "Expense not found" });
        }

        return Ok(expense);
    }

    /// <summary>
    /// Delete an expense entry
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var userId = GetUserId();
        var result = await _expenseService.DeleteExpenseAsync(id, userId);

        if (!result)
        {
            return NotFound(new { message = "Expense not found" });
        }

        return NoContent();
    }
}
