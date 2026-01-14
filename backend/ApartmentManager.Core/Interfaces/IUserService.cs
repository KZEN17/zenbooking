using ApartmentManager.Shared.DTOs;

namespace ApartmentManager.Core.Interfaces;

/// <summary>
/// Service interface for User management operations
/// </summary>
public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllUsersAsync();
    Task<UserDto?> GetUserByIdAsync(int id);
    Task DeleteUserAsync(int id);
}
