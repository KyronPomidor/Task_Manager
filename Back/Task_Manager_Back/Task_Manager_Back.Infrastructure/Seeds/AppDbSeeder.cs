using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Task_Manager_Back.Domain.Entities.Categories;
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

        // Seed default user category (TaskUserCategory)
        var userGuid = Guid.Parse(user.Id);

        if (!await db.Categories.OfType<TaskUserCategory>().AnyAsync(c => c.UserId == userGuid))
        {
            var category = new TaskUserCategory(new TaskUserCategoryCreateParams(
                UserId: userGuid,
                Title: "Default Category",
                Description: "Seeded category",
                ParentCategoryId: null,
                Color: "#FFFFFF"
            ));

            await db.Categories.AddAsync(category);
            await db.SaveChangesAsync();

            // Seed a task in that category
            var task = new TaskEntity(new TaskEntityCreateParams(
                UserId: userGuid,
                Title: "Sample Task",
                Description: "This is a seeded task",
                StatusId: null,
                Priority: null,
                CategoryId: category.Id,
                Deadline: null
            ));

            await db.Tasks.AddAsync(task);
            await db.SaveChangesAsync();
        }

    }
}
