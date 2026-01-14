using ApartmentManager.Core.Entities;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Repository interface for User-specific operations
/// </summary>
public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<bool> EmailExistsAsync(string email);
}
