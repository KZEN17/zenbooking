using System.ComponentModel.DataAnnotations;

namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for income information
/// </summary>
public class IncomeDto
{
    public int Id { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Date is required")]
    public DateTime Date { get; set; }

    [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }

    public int ApartmentId { get; set; }
}
