using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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
        if (existingUser == null)
        {
            var newUser = new IdentityUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(newUser, password);
            if (result.Succeeded)
                await userManager.AddToRoleAsync(newUser, roleName);
            else
                Console.WriteLine("Failed to create seed user: " +
                    string.Join(", ", result.Errors.Select(e => e.Description)));
        }
    }
}
