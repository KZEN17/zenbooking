using ApartmentManager.Core.Entities;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ApartmentManager.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for Apartment-specific operations
/// </summary>
public class ApartmentRepository : Repository<Apartment>, IApartmentRepository
{
    public ApartmentRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Apartment>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public override async Task<Apartment?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(a => a.Incomes)
            .Include(a => a.Expenses)
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}
