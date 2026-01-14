namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for login response containing JWT token and user info
/// </summary>
public class LoginResponseDto
{
    public required string Token { get; set; }

    public required UserDto User { get; set; }
}
