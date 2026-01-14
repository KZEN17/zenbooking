using ApartmentManager.Core.Entities;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Repository interface for Apartment-specific operations
/// </summary>
public interface IApartmentRepository : IRepository<Apartment>
{
    Task<IEnumerable<Apartment>> GetByUserIdAsync(int userId);
}
