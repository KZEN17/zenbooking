namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for monthly summary of an apartment's financials
/// </summary>
public class MonthlySummaryDto
{
    public int ApartmentId { get; set; }

    public required string ApartmentName { get; set; }

    public int Year { get; set; }

    public int Month { get; set; }

    public decimal TotalIncome { get; set; }

    public decimal TotalExpenses { get; set; }

    public decimal NetProfit { get; set; } // Income - Expenses

    public int IncomeCount { get; set; }

    public int ExpenseCount { get; set; }
}
