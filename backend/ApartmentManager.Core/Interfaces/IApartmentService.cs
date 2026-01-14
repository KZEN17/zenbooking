using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Service interface for apartment operations
/// </summary>
public interface IApartmentService
{
    Task<IEnumerable<ApartmentDto>> GetUserApartmentsAsync(int userId);
    Task<ApartmentDto?> GetApartmentByIdAsync(int id, int userId);
    Task<ApartmentDto> CreateApartmentAsync(CreateApartmentDto dto, int userId);
    Task<ApartmentDto?> UpdateApartmentAsync(int id, CreateApartmentDto dto, int userId);
    Task<bool> DeleteApartmentAsync(int id, int userId);
}
