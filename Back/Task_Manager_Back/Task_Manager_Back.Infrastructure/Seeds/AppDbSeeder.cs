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

        // -------------------------
        // Seed priorities
        // -------------------------
        if (!await db.DatabaseTaskPriorities.AnyAsync(p => p.UserId == user.Id))
        {
            var priorities = new[]
            {
                new DatabaseTaskPriority { Id = Guid.NewGuid(), UserId = user.Id, Name = "Low", Level = 1 },
                new DatabaseTaskPriority { Id = Guid.NewGuid(), UserId = user.Id, Name = "Medium", Level = 2 },
                new DatabaseTaskPriority { Id = Guid.NewGuid(), UserId = user.Id, Name = "High", Level = 3 }
            };
            db.DatabaseTaskPriorities.AddRange(priorities);
            await db.SaveChangesAsync();
        }

        // -------------------------
        // Seed statuses
        // -------------------------
        if (!await db.DatabaseTaskStatuses.AnyAsync(s => s.UserId == user.Id))
        {
            var statuses = new[]
            {
                new DatabaseTaskStatus { Id = Guid.NewGuid(), UserId = user.Id, Tittle = "Todo" },
                new DatabaseTaskStatus { Id = Guid.NewGuid(), UserId = user.Id, Tittle = "In Progress" },
                new DatabaseTaskStatus { Id = Guid.NewGuid(), UserId = user.Id, Tittle = "Done" }
            };
            db.DatabaseTaskStatuses.AddRange(statuses);
            await db.SaveChangesAsync();
        }

        // -------------------------
        // Seed labels
        // -------------------------
        if (!await db.DatabaseTaskLabels.AnyAsync(l => l.UserId == user.Id))
        {
            var labels = new[]
            {
                new DatabaseTaskLabel { Id = Guid.NewGuid(), UserId = user.Id, Name = "Urgent", Color = "#FF0000" },
                new DatabaseTaskLabel { Id = Guid.NewGuid(), UserId = user.Id, Name = "Optional", Color = "#00FF00" }
            };
            db.DatabaseTaskLabels.AddRange(labels);
            await db.SaveChangesAsync();
        }

        // -------------------------
        // Create tasks with all details
        // -------------------------
        var priority = await db.DatabaseTaskPriorities.FirstAsync(p => p.UserId == user.Id);
        var status = await db.DatabaseTaskStatuses.FirstAsync(s => s.UserId == user.Id);
        var label = await db.DatabaseTaskLabels.FirstAsync(l => l.UserId == user.Id);
        var category = await db.DatabaseTaskCustomCategories.FirstAsync(c => c.UserId == user.Id);

        var task4 = new DatabaseTaskEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Title = "Task 1",
            Description = "Seeded task with full details",
            Color = "#FFFFFF",
            DatabaseCustomCategoryId = category.Id,
            PriorityId = priority.Id,
            StatusId = status.Id,
            CreatedAt = DateTime.UtcNow,
            Deadline = DateTime.UtcNow.AddDays(7),
            PositionOrder = 1,
            Labels = new List<DatabaseTaskLabel> { label }
        };

        var task5 = new DatabaseTaskEntity
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Title = "Task 2",
            Description = "Second seeded task",
            Color = "#AAAAAA",
            DatabaseCustomCategoryId = category.Id,
            PriorityId = priority.Id,
            StatusId = status.Id,
            CreatedAt = DateTime.UtcNow,
            Deadline = DateTime.UtcNow.AddDays(3),
            PositionOrder = 2
        };

        db.DatabaseTaskEntities.AddRange(task4, task5);
        await db.SaveChangesAsync();

        // -------------------------
        // Add reminders
        // -------------------------
        db.DatabaseTaskReminders.Add(new DatabaseTaskReminder
        {
            Id = Guid.NewGuid(),
            TaskId = task1.Id,
            ReminderAt = DateTime.UtcNow.AddDays(1),
            Message = "Reminder for Task 1",
            IsSent = false
        });

        // -------------------------
        // Add attachments
        // -------------------------
        db.DatabaseTaskAttachments.Add(new DatabaseTaskAttachment
        {
            Id = Guid.NewGuid(),
            TaskId = task1.Id,
            UserId = user.Id,
            FilePath = "/files/doc1.pdf",
            FileType = "application/pdf",
            FileName = "doc1.pdf",
            Size = 12345
        });

        // -------------------------
        // Add dependencies
        // -------------------------
        db.DatabaseTaskDependencyRelations.Add(new DatabaseTaskDependencyRelation
        {
            FromTaskId = task2.Id,
            ToTaskId = task1.Id
        });

        // -------------------------
        // Add custom relations
        // -------------------------
        var relationType1 = await db.DatabaseRelationTypes.FirstAsync(rt => rt.UserId == user.Id);

        db.DatabaseTaskCustomRelations.Add(new DatabaseTaskCustomRelation
        {
            FromTaskId = task1.Id,
            ToTaskId = task2.Id,
            RelationTypeId = relationType.Id
        });

        await db.SaveChangesAsync();


    }
}
