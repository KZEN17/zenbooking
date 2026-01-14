using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Services;

/// <summary>
/// Service for financial summary calculations
/// </summary>
public class SummaryService : ISummaryService
{
    private readonly IApartmentRepository _apartmentRepository;
    private readonly IIncomeRepository _incomeRepository;
    private readonly IExpenseRepository _expenseRepository;

    public SummaryService(
        IApartmentRepository apartmentRepository,
        IIncomeRepository incomeRepository,
        IExpenseRepository expenseRepository)
    {
        _apartmentRepository = apartmentRepository;
        _incomeRepository = incomeRepository;
        _expenseRepository = expenseRepository;
    }

    public async Task<MonthlySummaryDto?> GetMonthlySummaryAsync(int apartmentId, int year, int month, int userId)
    {
        // Verify apartment ownership
        var apartment = await _apartmentRepository.GetByIdAsync(apartmentId);
        if (apartment == null || apartment.UserId != userId)
        {
            return null;
        }

        // Calculate date range for the month
        var startDate = new DateTime(year, month, 1);
        var endDate = startDate.AddMonths(1).AddDays(-1);

        // Get incomes and expenses for the month
        var incomes = await _incomeRepository.GetByApartmentAndDateRangeAsync(apartmentId, startDate, endDate);
        var expenses = await _expenseRepository.GetByApartmentAndDateRangeAsync(apartmentId, startDate, endDate);

        var totalIncome = incomes.Sum(i => i.Amount);
        var totalExpenses = expenses.Sum(e => e.Amount);

        return new MonthlySummaryDto
        {
            ApartmentId = apartmentId,
            ApartmentName = apartment.Name,
            Year = year,
            Month = month,
            TotalIncome = totalIncome,
            TotalExpenses = totalExpenses,
            NetProfit = totalIncome - totalExpenses,
            IncomeCount = incomes.Count(),
            ExpenseCount = expenses.Count()
        };
    }

    public async Task<IEnumerable<MonthlySummaryDto>> GetYearlySummaryAsync(int year, int userId)
    {
        // Get all user's apartments
        var apartments = await _apartmentRepository.GetByUserIdAsync(userId);

        var summaries = new List<MonthlySummaryDto>();

        foreach (var apartment in apartments)
        {
            for (int month = 1; month <= 12; month++)
            {
                var summary = await GetMonthlySummaryAsync(apartment.Id, year, month, userId);
                if (summary != null && (summary.TotalIncome > 0 || summary.TotalExpenses > 0))
                {
                    summaries.Add(summary);
                }
            }
        }

        return summaries.OrderBy(s => s.Month).ThenBy(s => s.ApartmentName);
    }
}
