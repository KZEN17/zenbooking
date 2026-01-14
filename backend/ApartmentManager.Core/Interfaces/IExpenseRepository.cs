using ApartmentManager.Core.Entities;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Repository interface for Expense-specific operations
/// </summary>
public interface IExpenseRepository : IRepository<Expense>
{
    Task<IEnumerable<Expense>> GetByApartmentIdAsync(int apartmentId);
    Task<IEnumerable<Expense>> GetByApartmentAndDateRangeAsync(int apartmentId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Expense>> GetByCategoryAsync(string category);
}
