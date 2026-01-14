using ApartmentManager.Core.Entities;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Services;

/// <summary>
/// Service for income operations
/// </summary>
public class IncomeService : IIncomeService
{
    private readonly IIncomeRepository _incomeRepository;
    private readonly IApartmentRepository _apartmentRepository;

    public IncomeService(IIncomeRepository incomeRepository, IApartmentRepository apartmentRepository)
    {
        _incomeRepository = incomeRepository;
        _apartmentRepository = apartmentRepository;
    }

    public async Task<IEnumerable<IncomeDto>> GetIncomesByApartmentAsync(int apartmentId, int userId)
    {
        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(apartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return Enumerable.Empty<IncomeDto>();
        }

        var incomes = await _incomeRepository.GetByApartmentIdAsync(apartmentId);
        return incomes.Select(MapToDto);
    }

    public async Task<IncomeDto?> GetIncomeByIdAsync(int id, int userId)
    {
        var income = await _incomeRepository.GetByIdAsync(id);
        if (income == null)
        {
            return null;
        }

        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(income.ApartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return null;
        }

        return MapToDto(income);
    }

    public async Task<IncomeDto> CreateIncomeAsync(CreateIncomeDto dto, int userId)
    {
        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(dto.ApartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            throw new UnauthorizedAccessException("You don't have access to this apartment");
        }

        var income = new Income
        {
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            ApartmentId = dto.ApartmentId,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _incomeRepository.AddAsync(income);
        return MapToDto(created);
    }

    public async Task<IncomeDto?> UpdateIncomeAsync(int id, CreateIncomeDto dto, int userId)
    {
        var income = await _incomeRepository.GetByIdAsync(id);
        if (income == null)
        {
            return null;
        }

        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(income.ApartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return null;
        }

        income.Amount = dto.Amount;
        income.Date = dto.Date;
        income.Description = dto.Description;

        await _incomeRepository.UpdateAsync(income);
        return MapToDto(income);
    }

    public async Task<bool> DeleteIncomeAsync(int id, int userId)
    {
        var income = await _incomeRepository.GetByIdAsync(id);
        if (income == null)
        {
            return false;
        }

        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(income.ApartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return false;
        }

        await _incomeRepository.DeleteAsync(income);
        return true;
    }

    private static IncomeDto MapToDto(Income income)
    {
        return new IncomeDto
        {
            Id = income.Id,
            Amount = income.Amount,
            Date = income.Date,
            Description = income.Description,
            CreatedAt = income.CreatedAt,
            ApartmentId = income.ApartmentId
        };
    }
}
