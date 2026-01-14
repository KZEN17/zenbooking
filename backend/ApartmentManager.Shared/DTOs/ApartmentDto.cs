using System.ComponentModel.DataAnnotations;

namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for apartment information
/// </summary>
public class ApartmentDto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Apartment name is required")]
    [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
    public required string Name { get; set; }

    [MaxLength(500, ErrorMessage = "Location cannot exceed 500 characters")]
    public string? Location { get; set; }

    public DateTime CreatedAt { get; set; }

    public int UserId { get; set; }
}
