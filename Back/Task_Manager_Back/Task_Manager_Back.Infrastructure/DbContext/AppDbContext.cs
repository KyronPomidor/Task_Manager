using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Task_Manager_Back.Domain.Entities.Categories;
using Task_Manager_Back.Domain.Entities.ShopRelated;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Infrastructure.DbContext;

public class AppDbContext : IdentityDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<TaskEntity> Tasks { get; set; } = null!;
    public DbSet<TaskLabel> TaskLabels { get; set; } = null!;
    public DbSet<TaskAttachment> TaskAttachments { get; set; } = null!;
    public DbSet<TaskReminder> TaskReminders { get; set; } = null!;
    public DbSet<TaskRelation> TaskRelations { get; set; } = null!;

    public DbSet<ShopItem> ShopItems { get; set; } = null!;

    public DbSet<TaskCategory> Categories { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ✅ Configure inheritance using Table-Per-Hierarchy (TPH)
        builder.Entity<TaskCategory>()
            .HasDiscriminator<string>("CategoryType")
            .HasValue<TaskInbox>("Inbox")
            .HasValue<TaskUserCategory>("UserCategory");

        // Optional: constraints
        builder.Entity<TaskInbox>().Property(c => c.Title).HasMaxLength(100);
        builder.Entity<TaskUserCategory>().Property(c => c.Color).HasMaxLength(7); // e.g. #RRGGBB
    }
}