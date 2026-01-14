using ApartmentManager.Core.Entities;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Services;

/// <summary>
/// Service for expense operations
/// </summary>
public class ExpenseService : IExpenseService
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly IApartmentRepository _apartmentRepository;

    public ExpenseService(IExpenseRepository expenseRepository, IApartmentRepository apartmentRepository)
    {
        _expenseRepository = expenseRepository;
        _apartmentRepository = apartmentRepository;
    }

    public async Task<IEnumerable<ExpenseDto>> GetExpensesByApartmentAsync(int apartmentId, int userId)
    {
        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(apartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return Enumerable.Empty<ExpenseDto>();
        }

        var expenses = await _expenseRepository.GetByApartmentIdAsync(apartmentId);
        return expenses.Select(MapToDto);
    }

    public async Task<ExpenseDto?> GetExpenseByIdAsync(int id, int userId)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);
        if (expense == null)
        {
            return null;
        }

        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(expense.ApartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return null;
        }

        return MapToDto(expense);
    }

    public async Task<ExpenseDto> CreateExpenseAsync(CreateExpenseDto dto, int userId)
    {
        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(dto.ApartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            throw new UnauthorizedAccessException("You don't have access to this apartment");
        }

        var expense = new Expense
        {
            Amount = dto.Amount,
            Date = dto.Date,
            Category = dto.Category,
            Description = dto.Description,
            ApartmentId = dto.ApartmentId,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _expenseRepository.AddAsync(expense);
        return MapToDto(created);
    }

    public async Task<ExpenseDto?> UpdateExpenseAsync(int id, CreateExpenseDto dto, int userId)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);
        if (expense == null)
        {
            return null;
        }

        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(expense.ApartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return null;
        }

        expense.Amount = dto.Amount;
        expense.Date = dto.Date;
        expense.Category = dto.Category;
        expense.Description = dto.Description;

        await _expenseRepository.UpdateAsync(expense);
        return MapToDto(expense);
    }

    public async Task<bool> DeleteExpenseAsync(int id, int userId)
    {
        var expense = await _expenseRepository.GetByIdAsync(id);
        if (expense == null)
        {
            return false;
        }

        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(expense.ApartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return false;
        }

        await _expenseRepository.DeleteAsync(expense);
        return true;
    }

    private static ExpenseDto MapToDto(Expense expense)
    {
        return new ExpenseDto
        {
            Id = expense.Id,
            Amount = expense.Amount,
            Date = expense.Date,
            Category = expense.Category,
            Description = expense.Description,
            CreatedAt = expense.CreatedAt,
            ApartmentId = expense.ApartmentId
        };
    }
}
