using System;
using Microsoft.EntityFrameworkCore;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;
using Task_Manager_Back.Infrastructure.DbContext;
using Task_Manager_Back.Infrastructure.Mappers;
using Microsoft.Extensions.Logging;

namespace Task_Manager_Back.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;
    private readonly ILogger<TaskRepository> _logger;

    public TaskRepository(AppDbContext context, ILogger<TaskRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<Guid> CreateAsync(TaskEntity task)
    {
        var dbEntity = task.ToDbEntity();  // Теперь использую TaskMappers.ToDbEntity(task);
        _logger.LogDebug("Full TaskEntity mapped to DB: {@dbEntity}", dbEntity);
        
        _context.Tasks.Add(dbEntity);  // EF добавит все коллекции каскадно
        await _context.SaveChangesAsync();
        return dbEntity.Id;
    }

    public Task DeleteAsync(TaskEntity task)
    {
        throw new NotImplementedException();
    }

    public async Task<List<TaskEntity>> GetAllAsync(Guid userId)
    {
        var dbEntities = await _context.Tasks
            .Where(t => t.UserId == userId)
            .Include(t => t.Labels).ThenInclude(l => l.Label) // Загружаем Labels и связанные DatabaseTaskLabel
            .Include(t => t.Reminders) // Загружаем Reminders
            .Include(t => t.Attachments) // Загружаем Attachments
            .Include(t => t.Dependencies) // Загружаем Dependencies
            .Include(t => t.CustomRelations) // Загружаем CustomRelations
            .ToListAsync();
        
        if (dbEntities == null || !dbEntities.Any())
            throw new KeyNotFoundException($"No tasks found for user ID {userId}."); // In tutorial exceptions in infrastructure is normal

        // Преобразуем в доменные сущности
        return dbEntities.Select(dbEntity => dbEntity.ToDomain()).ToList();
    }

    public async Task<TaskEntity> GetByIdAsync(Guid id)
    {
        var dbEntity = await _context.Tasks
            .Include(t => t.Labels).ThenInclude(l => l.Label)  // Если нужно полные labels
            .Include(t => t.Reminders)
            .Include(t => t.Attachments)
            .Include(t => t.Dependencies)
            .Include(t => t.CustomRelations)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (dbEntity == null)
            throw new KeyNotFoundException($"Task with ID {id} not found.");

        return dbEntity.ToDomain();
    }

    public Task UpdateAsync(TaskEntity task)
    {
        throw new NotImplementedException();
    }
}