using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Infrastructure.DatabaseEntities;
using Task_Manager_Back.Infrastructure.DbContext;

namespace Task_Manager_Back.Infrastructure.Seeds;


public static class AppDbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();


        // Ensure database is up to date
        await db.Database.MigrateAsync();

        // Seed roles
        string roleName = "User";
        if (!await roleManager.RoleExistsAsync(roleName))
            await roleManager.CreateAsync(new IdentityRole<Guid>(roleName));

        // Seed default user
        string email = "admin@example.com";
        string password = "Admin123!";

        var existingUser = await userManager.FindByEmailAsync(email);
        ApplicationUser user;
        if (existingUser == null)
        {
            user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
                await userManager.AddToRoleAsync(user, roleName);
            else
            {
                Console.WriteLine("Failed to create seed user: " +
                    string.Join(", ", result.Errors.Select(e => e.Description)));
                return;
            }
        }
        else
        {
            user = existingUser;
        }

        // -------------------------
        // Seed default categories
        // -------------------------
        var defaultCategories = new[]
        {
            new { Title = "Work", Parent = (DatabaseCustomCategory?)null },
            new { Title = "Personal", Parent = (DatabaseCustomCategory?)null },
            new { Title = "Shopping", Parent = (DatabaseCustomCategory?)null },
            new { Title = "Study", Parent = (DatabaseCustomCategory?)null },
            new { Title = "Fitness", Parent = (DatabaseCustomCategory?)null }
        };

        foreach (var cat in defaultCategories)
        {
            if (!await db.DatabaseTaskCustomCategories.AnyAsync(c => c.Title == cat.Title && c.UserId == user.Id))
            {
                var newCategory = new DatabaseCustomCategory
                {
                    Title = cat.Title,
                    UserId = user.Id,
                    Order = 0,
                    ParentCategoryId = cat.Parent?.Id
                };
                db.DatabaseTaskCustomCategories.Add(newCategory);
            }
        }

        await db.SaveChangesAsync();



        // -------------------------
        // Seed default relation type
        // -------------------------
        var defaultRelationTypeName = "DependsOn";
        var relationType = await db.DatabaseRelationTypes
            .FirstOrDefaultAsync(rt => rt.Name == defaultRelationTypeName && rt.UserId == user.Id);

        if (relationType == null)
        {
            relationType = new DatabaseRelationType
            {
                Name = defaultRelationTypeName,
                UserId = user.Id,
                Color = "#FF0000" // красный для наглядности
            };
            db.DatabaseRelationTypes.Add(relationType);
            await db.SaveChangesAsync();
        }

        // -------------------------
        // Seed some tasks with relations
        // -------------------------

        var task1 = new DatabaseTaskEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Title = "Task 1",
            Color = "#FFFFFF",
            DatabaseCustomCategoryId = db.DatabaseTaskCustomCategories.First().Id
        };

        var task2 = new DatabaseTaskEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Title = "Task 2",
            Color = "#FFFFFF",
            DatabaseCustomCategoryId = db.DatabaseTaskCustomCategories.First().Id
        };

        var task3 = new DatabaseTaskEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Title = "Task 3",
            Color = "#FFFFFF",
            DatabaseCustomCategoryId = db.DatabaseTaskCustomCategories.First().Id
        };

        // Add tasks to context
        db.DatabaseTaskEntities.AddRange(task1, task2, task3);

        // Create a default relation type
        var defaultRelationType = new DatabaseRelationType
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Name = "Related",
            Color = "#FF0000"
        };
        db.DatabaseRelationTypes.Add(defaultRelationType);

        // Save tasks and relation type first to have IDs
        await db.SaveChangesAsync();

        // Now create relations
        var relations = new List<DatabaseTaskCustomRelation>
        {
            new() { FromTaskId = task1.Id, ToTaskId = task2.Id, RelationTypeId = defaultRelationType.Id },
            new() { FromTaskId = task1.Id, ToTaskId = task3.Id, RelationTypeId = defaultRelationType.Id },
            new() { FromTaskId = task2.Id, ToTaskId = task3.Id, RelationTypeId = defaultRelationType.Id },
            new() { FromTaskId = task3.Id, ToTaskId = task1.Id, RelationTypeId = defaultRelationType.Id } // циклическая связь для теста
        };

        db.DatabaseTaskCustomRelations.AddRange(relations);

        await db.SaveChangesAsync();



    }
}
