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

    public DbSet<Category> Categories { get; set; } = null!;
}