using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Service interface for income operations
/// </summary>
public interface IIncomeService
{
    Task<IEnumerable<IncomeDto>> GetIncomesByApartmentAsync(int apartmentId, int userId);
    Task<IncomeDto?> GetIncomeByIdAsync(int id, int userId);
    Task<IncomeDto> CreateIncomeAsync(CreateIncomeDto dto, int userId);
    Task<IncomeDto?> UpdateIncomeAsync(int id, CreateIncomeDto dto, int userId);
    Task<bool> DeleteIncomeAsync(int id, int userId);
}
