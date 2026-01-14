using ApartmentManager.Core.Entities;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Services;

/// <summary>
/// Service for authentication operations
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public AuthService(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        // Find user by email
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return null; // User not found
        }

        // Verify password using BCrypt
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return null; // Invalid password
        }

        // Generate JWT token
        var token = _jwtService.GenerateToken(user);

        return new LoginResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            }
        };
    }

    public async Task<UserDto> RegisterAsync(RegisterRequestDto request)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(request.Email))
        {
            throw new InvalidOperationException("Email already exists");
        }

        // Hash password using BCrypt
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Create new user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = passwordHash,
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };

        var createdUser = await _userRepository.AddAsync(user);

        return new UserDto
        {
            Id = createdUser.Id,
            Email = createdUser.Email,
            Role = createdUser.Role,
            CreatedAt = createdUser.CreatedAt
        };
    }
}
