using ApartmentManager.Core.Entities;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Service interface for JWT token generation
/// </summary>
public interface IJwtService
{
    string GenerateToken(User user);
}
