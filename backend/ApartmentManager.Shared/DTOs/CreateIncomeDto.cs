using System.ComponentModel.DataAnnotations;

namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for creating a new income entry
/// </summary>
public class CreateIncomeDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Date is required")]
    public DateTime Date { get; set; }

    [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "ApartmentId is required")]
    public int ApartmentId { get; set; }
}
