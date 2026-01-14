using ApartmentManager.Core.Entities;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ApartmentManager.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Income-specific operations
/// </summary>
public class IncomeRepository : Repository<Income>, IIncomeRepository
{
    public IncomeRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Income>> GetByApartmentIdAsync(int apartmentId)
    {
        return await _dbSet
            .Where(i => i.ApartmentId == apartmentId)
            .OrderByDescending(i => i.Date)
            .ToListAsync();
    }

    public async Task<IEnumerable<Income>> GetByApartmentAndDateRangeAsync(int apartmentId, DateTime startDate, DateTime endDate)
    {
        return await _dbSet
            .Where(i => i.ApartmentId == apartmentId && i.Date >= startDate && i.Date <= endDate)
            .OrderByDescending(i => i.Date)
            .ToListAsync();
    }
}
