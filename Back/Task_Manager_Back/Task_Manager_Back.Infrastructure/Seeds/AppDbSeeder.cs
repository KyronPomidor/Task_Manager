using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Task_Manager_Back.Domain.Entities.Enums;
using Task_Manager_Back.Domain.Entities.TaskCategories;
using Task_Manager_Back.Domain.Entities.TaskRelated;
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

        // inside SeedAsync
        var userGuid = Guid.Parse(user.Id);

        // find demo category
        var category = await db.Categories
            .OfType<TaskUserCategory>()
            .FirstOrDefaultAsync(c => c.UserId == userGuid && c.Title == "Default Category");

        if (category == null)
        {
            category = new TaskUserCategory(new TaskUserCategoryCreateParams(
                UserId: userGuid,
                Title: "Default Category",
                Description: "Seeded category",
                ParentCategoryId: null,
                Color: "#FFFFFF"
            ));
            await db.Categories.AddAsync(category);
            await db.SaveChangesAsync();
        }

        // 🔄 clear old demo tasks
        var oldTasks = db.Tasks.Where(t => t.UserId == userGuid && t.Title.StartsWith("Seeded Task"));
        db.Tasks.RemoveRange(oldTasks);
        await db.SaveChangesAsync();

        // 🔁 add fresh tasks
        var priorities = Enum.GetValues<TaskPriority>();
        var tasks = new List<TaskEntity>();

        for (int i = 1; i <= 10; i++)
        {
            var priority = priorities[(i - 1) % priorities.Length];
            tasks.Add(new TaskEntity(new TaskEntityCreateParams(
                UserId: userGuid,
                Title: $"Seeded Task {i}",
                Color: "#FFFFFF",
                Description: $"This is seeded task number {i} with {priority} priority",
                StatusId: null,
                Priority: priority,
                CategoryId: category.Id,
                Deadline: DateTime.UtcNow.AddDays(i)
            )));
        }

        await db.Tasks.AddRangeAsync(tasks);
        await db.SaveChangesAsync();

    }
}
