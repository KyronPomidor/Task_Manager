using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Task_Manager_Back.Infrastructure.DatabaseEntities;
using Task_Manager_Back.Infrastructure.DbContext;

namespace Task_Manager_Back.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DebugController : Controller
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly AppDbContext _dbContext;

    public DebugController(UserManager<ApplicationUser> userManager, AppDbContext dbContext)
    {
        _userManager = userManager;
        _dbContext = dbContext;
    }

    [HttpGet("userIds")]
    public IActionResult GetUserIds()
    {
        // Get all users
        var users = _userManager.Users.ToList();

        // If you want only Ids:
        // var userIds = users.Select(u => u.Id);

        return Ok(users); // returns all user info as JSON
    }

    [HttpGet("categories")]
    public IActionResult GetAllCategories()
    {
        // Include User info and optionally SubCategories
        var categories = _dbContext.DatabaseTaskCustomCategories
            .Include(c => c.User)
            .Include(c => c.SubCategories)
            .ToList();

        return Ok(categories);
    }

    // Все dependency relations
    [HttpGet("dependencies")]
    public IActionResult GetAllDependencies()
    {
        var deps = _dbContext.DatabaseTaskDependencyRelations
            .ToList();

        var options = new System.Text.Json.JsonSerializerOptions
        {
            ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles,
            WriteIndented = true
        };

        return new JsonResult(deps, options);
    }


    // Все reminders
    [HttpGet("reminders")]
    public IActionResult GetAllReminders()
    {
        var reminders = _dbContext.DatabaseTaskReminders
            .ToList();

        return Ok(reminders);
    }

    // Все attachments
    [HttpGet("attachments")]
    public IActionResult GetAllAttachments()
    {
        var attachments = _dbContext.DatabaseTaskAttachments
            .ToList();

        return Ok(attachments);
    }

    // Все custom relations
    [HttpGet("custom-relations")]
    public IActionResult GetAllCustomRelations()
    {
        var customRelations = _dbContext.DatabaseTaskCustomRelations
            .ToList();

        return Ok(customRelations);
    }

    // Все задачи
    [HttpGet("tasks")]
    public IActionResult GetAllTasks()
    {
        var tasks = _dbContext.DatabaseTaskEntities
            .ToList();

        return Ok(tasks);
    }
}