using System.Security.Claims;
using ApartmentManager.Core.Interfaces;
using ApartmentManager.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApartmentManager.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ApartmentsController : ControllerBase
{
    private readonly IApartmentService _apartmentService;

    public ApartmentsController(IApartmentService apartmentService)
    {
        _apartmentService = apartmentService;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }

    /// <summary>
    /// Get all apartments for the authenticated user
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApartmentDto>>> GetUserApartments()
    {
        var userId = GetUserId();
        var apartments = await _apartmentService.GetUserApartmentsAsync(userId);
        return Ok(apartments);
    }

    /// <summary>
    /// Get a specific apartment by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApartmentDto>> GetApartment(int id)
    {
        var userId = GetUserId();
        var apartment = await _apartmentService.GetApartmentByIdAsync(id, userId);

        if (apartment == null)
        {
            return NotFound(new { message = "Apartment not found" });
        }

        return Ok(apartment);
    }

    /// <summary>
    /// Create a new apartment
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApartmentDto>> CreateApartment([FromBody] CreateApartmentDto dto)
    {
        var userId = GetUserId();
        var apartment = await _apartmentService.CreateApartmentAsync(dto, userId);
        return CreatedAtAction(nameof(GetApartment), new { id = apartment.Id }, apartment);
    }

    /// <summary>
    /// Update an existing apartment
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ApartmentDto>> UpdateApartment(int id, [FromBody] CreateApartmentDto dto)
    {
        var userId = GetUserId();
        var apartment = await _apartmentService.UpdateApartmentAsync(id, dto, userId);

        if (apartment == null)
        {
            return NotFound(new { message = "Apartment not found" });
        }

        return Ok(apartment);
    }

    /// <summary>
    /// Delete an apartment
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApartment(int id)
    {
        var userId = GetUserId();
        var result = await _apartmentService.DeleteApartmentAsync(id, userId);

        if (!result)
        {
            return NotFound(new { message = "Apartment not found" });
        }

        return NoContent();
    }
}
