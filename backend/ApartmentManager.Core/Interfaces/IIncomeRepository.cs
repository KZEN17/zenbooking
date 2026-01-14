using ApartmentManager.Core.Entities;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Repository interface for Income-specific operations
/// </summary>
public interface IIncomeRepository : IRepository<Income>
{
    Task<IEnumerable<Income>> GetByApartmentIdAsync(int apartmentId);
    Task<IEnumerable<Income>> GetByApartmentAndDateRangeAsync(int apartmentId, DateTime startDate, DateTime endDate);
}
