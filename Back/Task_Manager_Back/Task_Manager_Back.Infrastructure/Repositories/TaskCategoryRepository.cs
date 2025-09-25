using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Task_Manager_Back.Domain.Entities.TaskEntity;
using Task_Manager_Back.Domain.IRepositories;
using Task_Manager_Back.Infrastructure.DbContext;
using Task_Manager_Back.Infrastructure.Mappers;

namespace Task_Manager_Back.Infrastructure.Repositories;
public class TaskCategoryRepository : ITaskCategoryRepository
{
    private readonly AppDbContext _context;
    private readonly ILogger<TaskCategoryRepository> _logger;

    public TaskCategoryRepository(AppDbContext context, ILogger<TaskCategoryRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<CustomCategory?> GetByIdAsync(Guid id)
    {
        var dbCategory = await _context.DatabaseTaskCustomCategories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (dbCategory == null)
        {
            _logger.LogWarning("Category with ID {Id} not found", id);
            return null;
        }

        return dbCategory.ToDomain();
    }
}
