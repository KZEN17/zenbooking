using ApartmentManager.Core.Entities;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ApartmentManager.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Expense-specific operations
/// </summary>
public class ExpenseRepository : Repository<Expense>, IExpenseRepository
{
    public ExpenseRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Expense>> GetByApartmentIdAsync(int apartmentId)
    {
        return await _dbSet
            .Where(e => e.ApartmentId == apartmentId)
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Expense>> GetByApartmentAndDateRangeAsync(int apartmentId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(e => e.ApartmentId == apartmentId && e.Date >= startDate && e.Date <= endDate)
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Expense>> GetByCategoryAsync(string category)
    {
        return await _dbSet
            .Where(e => e.Category == category)
            .OrderByDescending(e => e.Date)
            .ToListAsync();
    }
}
