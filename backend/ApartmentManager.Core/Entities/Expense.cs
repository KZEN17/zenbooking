namespace ApartmentManager.Core.Entities;

/// <summary>
/// Represents an expense for an apartment (maintenance, utilities, tax, etc.)
/// </summary>
public class Expense
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public required string Category { get; set; } // "Maintenance", "Utilities", "Tax", etc.

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to Apartment
    public int ApartmentId { get; set; }

    // Navigation property
    public Apartment Apartment { get; set; } = null!;
}
