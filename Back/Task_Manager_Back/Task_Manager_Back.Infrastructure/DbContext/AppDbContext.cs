using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Task_Manager_Back.Infrastructure.DatabaseEntities;

namespace Task_Manager_Back.Infrastructure.DbContext;

public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<DatabaseCustomCategory> DatabaseTaskCustomCategories { get; set; } = null!;
    public DbSet<DatabaseRelationType> DatabaseRelationTypes { get; set; } = null!;
    public DbSet<DatabaseTaskAttachment> DatabaseTaskAttachments { get; set; } = null!;
    public DbSet<DatabaseTaskCustomRelation> DatabaseTaskCustomRelations { get; set; } = null!;
    public DbSet<DatabaseTaskDependencyRelation> DatabaseTaskDependencyRelations { get; set; } = null!;
    public DbSet<DatabaseTaskEntity> DatabaseTaskEntities { get; set; } = null!;
    public DbSet<DatabaseTaskLabel> DatabaseTaskLabels { get; set; } = null!;
    public DbSet<DatabaseTaskPriority> DatabaseTaskPriorities { get; set; } = null!;
    public DbSet<DatabaseTaskReminder> DatabaseTaskReminders { get; set; } = null!;
    public DbSet<DatabaseTaskStatus> DatabaseTaskStatuses { get; set; } = null!;

    // Many-to-Many relationship between Task and TaskLabel
    //public DbSet<DatabaseTaskTaskLabel> TaskTaskLabels { get; set; } = null!;


    // TODO: register another DbSet properties here


    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // ----------------------
        // DatabaseTaskCustomRelation
        // ----------------------
        builder.Entity<DatabaseTaskCustomRelation>()
            .HasKey(r => new { r.FromTaskId, r.ToTaskId, r.RelationTypeId });

        builder.Entity<DatabaseTaskCustomRelation>()
            .HasOne(r => r.FromTask)
            .WithMany(t => t.CustomRelationsFrom)
            .HasForeignKey(r => r.FromTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DatabaseTaskCustomRelation>()
            .HasOne(r => r.ToTask)
            .WithMany(t => t.CustomRelationsTo)
            .HasForeignKey(r => r.ToTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DatabaseTaskCustomRelation>()
            .HasOne(r => r.RelationType)
            .WithMany(rt => rt.CustomRelations)
            .HasForeignKey(r => r.RelationTypeId)
            .OnDelete(DeleteBehavior.Restrict);

        // ----------------------
        // DatabaseTaskDependencyRelation
        // ----------------------
        builder.Entity<DatabaseTaskDependencyRelation>()
            .HasKey(r => new { r.FromTaskId, r.ToTaskId });

        builder.Entity<DatabaseTaskDependencyRelation>()
            .HasOne(r => r.FromTask)
            .WithMany(t => t.DependenciesFrom)
            .HasForeignKey(r => r.FromTaskId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DatabaseTaskDependencyRelation>()
            .HasOne(r => r.ToTask)
            .WithMany(t => t.DependenciesTo)
            .HasForeignKey(r => r.ToTaskId)
            .OnDelete(DeleteBehavior.Restrict);


        builder.Entity<DatabaseTaskEntity>()
            .HasOne(t => t.User)
            .WithMany()
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DatabaseTaskEntity>()
            .HasOne(t => t.Priority)
            .WithMany()
            .HasForeignKey(t => t.PriorityId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DatabaseTaskEntity>()
            .HasOne(t => t.Status)
            .WithMany()
            .HasForeignKey(t => t.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DatabaseTaskEntity>()
            .HasOne(t => t.DatabaseCustomCategory)
            .WithMany()
            .HasForeignKey(t => t.DatabaseCustomCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<DatabaseTaskAttachment>()
            .HasOne(a => a.Task)
            .WithMany(t => t.Attachments)
            .HasForeignKey(a => a.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<DatabaseTaskReminder>()
            .HasOne(r => r.Task)
            .WithMany(t => t.Reminders)
            .HasForeignKey(r => r.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<DatabaseTaskLabel>()
            .HasMany(l => l.Tasks)
            .WithMany(t => t.Labels);




    }

}
