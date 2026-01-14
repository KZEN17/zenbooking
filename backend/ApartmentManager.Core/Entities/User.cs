namespace ApartmentManager.Core.Entities;

/// <summary>
/// Represents a user in the system (Admin or regular User role)
/// </summary>
public class User
{
    public int Id { get; set; }

    public required string Email { get; set; }

    public required string PasswordHash { get; set; }

    public required string Role { get; set; } // "Admin" or "User"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property: One user can have many apartments
    public ICollection<Apartment> Apartments { get; set; } = new List<Apartment>();
}
