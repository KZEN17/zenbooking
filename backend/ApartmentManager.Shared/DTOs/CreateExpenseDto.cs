using System.ComponentModel.DataAnnotations;

namespace ApartmentManager.Shared.DTOs;

/// <summary>
/// DTO for creating a new expense entry
/// </summary>
public class CreateExpenseDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public decimal Amount { get; set; }

    [Required(ErrorMessage = "Date is required")]
    public DateTime Date { get; set; }

    [Required(ErrorMessage = "Category is required")]
    [MaxLength(100, ErrorMessage = "Category cannot exceed 100 characters")]
    public required string Category { get; set; }

    [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "ApartmentId is required")]
    public int ApartmentId { get; set; }
}
