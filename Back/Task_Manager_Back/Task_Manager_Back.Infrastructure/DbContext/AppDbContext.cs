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

        // TaskCategory inheritance (TPH)
        builder.Entity<TaskCategory>()
            .HasDiscriminator<string>("CategoryType")
            .HasValue<TaskInbox>("Inbox")
            .HasValue<TaskUserCategory>("UserCategory");

        builder.Entity<TaskInbox>().Property(c => c.Title).HasMaxLength(100);
        builder.Entity<TaskUserCategory>().Property(c => c.Color).HasMaxLength(7);

        // Map TaskEntity private collections using backing fields
        builder.Entity<TaskEntity>()
            .HasMany<TaskAttachment>("Attachments")
            .WithOne()
            .HasForeignKey("TaskId")
            .IsRequired();

        builder.Entity<TaskEntity>()
            .HasMany<TaskReminder>("Reminders")
            .WithOne()
            .HasForeignKey("TaskId")
            .IsRequired();

        builder.Entity<TaskEntity>()
            .HasMany<TaskRelation>("TaskRelations")
            .WithOne()
            .HasForeignKey("FromTaskId")
            .IsRequired();

        builder.Entity<TaskEntity>()
            .HasMany<ShopItem>("ShopItems")
            .WithOne()
            .HasForeignKey("TaskId")
            .IsRequired();

        builder.Entity<TaskEntity>()
            .HasMany<TaskLabel>("Labels")
            .WithOne()
            .HasForeignKey("TaskId")
            .IsRequired();
    }
}