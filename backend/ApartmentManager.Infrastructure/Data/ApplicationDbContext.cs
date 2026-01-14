using ApartmentManager.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApartmentManager.Infrastructure.Data;

/// <summary>
/// DbContext is the main class that coordinates Entity Framework functionality
/// for your data model. Think of it as a session with the database.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSet properties represent tables in your database
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Apartment> Apartments { get; set; } = null!;
    public DbSet<Income> Incomes { get; set; } = null!;
    public DbSet<Expense> Expenses { get; set; } = null!;

    /// <summary>
    /// This method is called when the model is being created.
    /// Use it to configure entity relationships, indexes, constraints, etc.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.HasIndex(e => e.Email).IsUnique(); // Email must be unique
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.Role).IsRequired().HasMaxLength(50);
        });

        // Apartment configuration
        modelBuilder.Entity<Apartment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Location).HasMaxLength(500);

            // Define relationship: User has many Apartments
            entity.HasOne(e => e.User)
                .WithMany(u => u.Apartments)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade); // If user is deleted, delete their apartments
        });

        // Income configuration
        modelBuilder.Entity<Income>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasPrecision(18, 2); // Decimal with 2 decimal places
            entity.Property(e => e.Date).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(1000);

            // Define relationship: Apartment has many Incomes
            entity.HasOne(e => e.Apartment)
                .WithMany(a => a.Incomes)
                .HasForeignKey(e => e.ApartmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Expense configuration
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Date).IsRequired();
            entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(1000);

            // Define relationship: Apartment has many Expenses
            entity.HasOne(e => e.Apartment)
                .WithMany(a => a.Expenses)
                .HasForeignKey(e => e.ApartmentId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
