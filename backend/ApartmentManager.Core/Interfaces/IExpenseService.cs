using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Service interface for expense operations
/// </summary>
public interface IExpenseService
{
    Task<IEnumerable<ExpenseDto>> GetExpensesByApartmentAsync(int apartmentId, int userId);
    Task<ExpenseDto?> GetExpenseByIdAsync(int id, int userId);
    Task<ExpenseDto> CreateExpenseAsync(CreateExpenseDto dto, int userId);
    Task<ExpenseDto?> UpdateExpenseAsync(int id, CreateExpenseDto dto, int userId);
    Task<bool> DeleteExpenseAsync(int id, int userId);
}
