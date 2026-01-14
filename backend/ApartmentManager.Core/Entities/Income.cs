namespace ApartmentManager.Core.Entities;

/// <summary>
/// Represents rental income for an apartment
/// </summary>
public class Income
{
    public int Id { get; set; }

    public decimal Amount { get; set; }

    public DateTime Date { get; set; }

    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign key to Apartment
    public int ApartmentId { get; set; }

    // Navigation property
    public Apartment Apartment { get; set; } = null!;
}
