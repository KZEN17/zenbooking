using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Service interface for financial summary operations
/// </summary>
public interface ISummaryService
{
    Task<MonthlySummaryDto?> GetMonthlySummaryAsync(int apartmentId, int year, int month, int userId);
    Task<IEnumerable<MonthlySummaryDto>> GetYearlySummaryAsync(int year, int userId);
}
