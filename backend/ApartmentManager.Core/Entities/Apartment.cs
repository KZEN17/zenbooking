namespace ApartmentManager.Core.Entities;

/// <summary>
/// Represents an apartment that generates income and has expenses
/// </summary>
public class Apartment
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public string? Location { get; set; } // Nullable - location is optional

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to User
    public int UserId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!; // null! means "trust me, EF will set this"

    public ICollection<Income> Incomes { get; set; } = new List<Income>();

    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}
