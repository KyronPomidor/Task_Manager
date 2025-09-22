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

    public DbSet<DatabaseTaskEntity> Tasks { get; set; } = null!;
    public DbSet<DatabaseTaskCategory> TaskCategories { get; set; } = null!;
    // register another DbSet properties here
}
