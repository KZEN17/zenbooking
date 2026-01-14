using System.ComponentModel.DataAnnotations;

namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for user registration
/// </summary>
public class RegisterRequestDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public required string Password { get; set; }

    [Required(ErrorMessage = "Role is required")]
    public required string Role { get; set; } // "Admin" or "User"
}
