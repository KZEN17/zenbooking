using System.ComponentModel.DataAnnotations;

namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for creating a new apartment
/// </summary>
public class CreateApartmentDto
{
    [Required(ErrorMessage = "Apartment name is required")]
    [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
    public required string Name { get; set; }

    [MaxLength(500, ErrorMessage = "Location cannot exceed 500 characters")]
    public string? Location { get; set; }
}
