using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Task_Manager_Back.Domain.Entities.Enums;
using Task_Manager_Back.Domain.Entities.TaskCategories;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Infrastructure.DbContext;

namespace Task_Manager_Back.Infrastructure.Seeds;

public static class AppDbSeeder
{

    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var categoryRepo = scope.ServiceProvider.GetRequiredService<ITaskCategoryRepository>();
        var taskRepo = scope.ServiceProvider.GetRequiredService<ITaskRepository>();

        // Ensure database is up to date
        await db.Database.MigrateAsync();

        // Seed roles
        string roleName = "User";
        if (!await roleManager.RoleExistsAsync(roleName))
            await roleManager.CreateAsync(new IdentityRole(roleName));

        // Seed default user
        string email = "admin@example.com";
        string password = "Admin123!";

        var existingUser = await userManager.FindByEmailAsync(email);
        IdentityUser user;
        if (existingUser == null)
        {
            user = new IdentityUser
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

        var userGuid = Guid.Parse(user.Id);

        // --- CATEGORIES ---
        var inbox = await categoryRepo.GetOrCreateInboxByUserId(userGuid);

        // Helper function to ensure category exists
        async Task<TaskUserCategory> EnsureCategoryAsync(string title, string? description, Guid? parentId, string color)
        {
            var existing = await db.Categories
                .FirstOrDefaultAsync(c => c.UserId == userGuid && c.Title == title);

            if (existing != null)
                return (TaskUserCategory) existing;

            var category = new TaskUserCategory(new TaskUserCategoryCreateParams(
                userGuid, title, description, parentId, color));

            await categoryRepo.CreateAsync(category);
            return category;
        }

        // Work
        var work = await EnsureCategoryAsync("Work", "Work related tasks", null, "#FFD700");

        // Work subcategories
        var firstTaskCategory = await EnsureCategoryAsync("First task", "Subcategory of Work", work.Id, "#87CEEB");
        var secondTaskCategory = await EnsureCategoryAsync("Second task", "Subcategory of Work", work.Id, "#90EE90");

        // Personal
        var personal = await EnsureCategoryAsync("Personal", "Personal life tasks", null, "#FF69B4");

        // Personal subcategory
        var fun = await EnsureCategoryAsync("Fun", "Personal fun activities", personal.Id, "#BA55D3");

        // --- TASKS ---
        // Clear old seeded tasks
        var oldTasks = db.Tasks.Where(t => t.UserId == userGuid && t.Title.StartsWith("Seeded Task"));

        if (oldTasks is not null)
        {
            db.Tasks.RemoveRange(oldTasks);
        }

        await db.SaveChangesAsync();

        // Add fresh demo tasks into Inbox
        var priorities = Enum.GetValues<TaskPriority>();
        for (int i = 1; i <= 10; i++)
        {
            var priority = priorities[(i - 1) % priorities.Length];
            var task = new TaskEntity(new TaskEntityCreateParams(
                UserId: userGuid,
                Title: $"Seeded Task {i}",
                Color: "#FFFFFF",
                Description: $"This is seeded task number {i} with {priority} priority",
                StatusId: null,
                Priority: priority,
                CategoryId: inbox.Id, // assign to Inbox
                Deadline: DateTime.UtcNow.AddDays(i),
                IsCompleted: i % 2 == 0,
                PositionOrder: i,
                Price: Random.Shared.Next(50, 250),
                DependsOnTasksIds: []
            ));

            await taskRepo.CreateAsync(task);
        }
    }
}
