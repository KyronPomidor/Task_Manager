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
        // Inbox (always exists)
        var inbox = await categoryRepo.GetOrCreateInboxByUserId(userGuid);

        // Work category
        var work = new TaskUserCategory(new TaskUserCategoryCreateParams(
            userGuid, "Work", "Work related tasks", null, "#FFD700"));
        await categoryRepo.CreateAsync(work);

        // Work subcategories
        var firstTaskCategory = new TaskUserCategory(new TaskUserCategoryCreateParams(
            userGuid, "First task", "Subcategory of Work", work.Id, "#87CEEB"));
        await categoryRepo.CreateAsync(firstTaskCategory);

        var secondTaskCategory = new TaskUserCategory(new TaskUserCategoryCreateParams(
            userGuid, "Second task", "Subcategory of Work", work.Id, "#90EE90"));
        await categoryRepo.CreateAsync(secondTaskCategory);

        // Personal category
        var personal = new TaskUserCategory(new TaskUserCategoryCreateParams(
            userGuid, "Personal", "Personal life tasks", null, "#FF69B4"));
        await categoryRepo.CreateAsync(personal);

        // Personal subcategory
        var fun = new TaskUserCategory(new TaskUserCategoryCreateParams(
            userGuid, "Fun", "Personal fun activities", personal.Id, "#BA55D3"));
        await categoryRepo.CreateAsync(fun);

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
                IsCompleted: false,
                PositionOrder: i,
                Price: Random.Shared.Next(50, 250)
            ));

            await taskRepo.CreateAsync(task);
        }
    }
}
