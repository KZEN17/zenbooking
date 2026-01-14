namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for user information (without sensitive data like password)
/// </summary>
public class UserDto
{
    public int Id { get; set; }

    public required string Email { get; set; }

    public required string Role { get; set; }

    public DateTime CreatedAt { get; set; }
}
