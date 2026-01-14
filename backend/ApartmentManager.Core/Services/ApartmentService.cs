using ApartmentManager.Core.Entities;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Services;

/// <summary>
/// Service for apartment operations
/// </summary>
public class ApartmentService : IApartmentService
{
    private readonly IApartmentRepository _apartmentRepository;

    public ApartmentService(IApartmentRepository apartmentRepository)
    {
        _apartmentRepository = apartmentRepository;
    }

    public async Task<IEnumerable<ApartmentDto>> GetUserApartmentsAsync(int userId)
    {
        var apartments = await _apartmentRepository.GetByUserIdAsync(userId);
        return apartments.Select(MapToDto);
    }

    public async Task<ApartmentDto?> GetApartmentByIdAsync(int id, int userId)
    {
        var apartment = await _apartmentRepository.GetByIdAsync(id);

        if (apartment == null || apartment.UserId != userId)
        {
            return null; // Not found or user doesn't own this apartment
        }

        return MapToDto(apartment);
    }

    public async Task<ApartmentDto> CreateApartmentAsync(CreateApartmentDto dto, int userId)
    {
        var apartment = new Apartment
        {
            Name = dto.Name,
            Location = dto.Location,
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _apartmentRepository.AddAsync(apartment);
        return MapToDto(created);
    }

    public async Task<ApartmentDto?> UpdateApartmentAsync(int id, CreateApartmentDto dto, int userId)
    {
        var apartment = await _apartmentRepository.GetByIdAsync(id);

        if (apartment == null || apartment.UserId != userId)
        {
            return null; // Not found or user doesn't own this apartment
        }

        apartment.Name = dto.Name;
        apartment.Location = dto.Location;

        await _apartmentRepository.UpdateAsync(apartment);
        return MapToDto(apartment);
    }

    public async Task<bool> DeleteApartmentAsync(int id, int userId)
    {
        var apartment = await _apartmentRepository.GetByIdAsync(id);

        if (apartment == null || apartment.UserId != userId)
        {
            return false; // Not found or user doesn't own this apartment
        }

        await _apartmentRepository.DeleteAsync(apartment);
        return true;
    }

    private static ApartmentDto MapToDto(Apartment apartment)
    {
        return new ApartmentDto
        {
            Id = apartment.Id,
            Name = apartment.Name,
            Location = apartment.Location,
            CreatedAt = apartment.CreatedAt,
            UserId = apartment.UserId
        };
    }
}
