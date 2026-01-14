using ApartmentManager.Core.Entities;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ApartmentManager.Infrastructure.Repositories;

/// <summary>
/// Repository implementation for User-specific operations
/// </summary>
public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _dbSet.AnyAsync(u => u.Email == email);
    }
}
