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

        _context.DatabaseTaskEntities.Add(dbEntity);  // EF добавит все коллекции каскадно
        await _context.SaveChangesAsync();
        return dbEntity.Id;
    }

    public async Task DeleteAsync(TaskEntity task)
    {
        // 1. Загружаем задачу из базы вместе с зависимостями
        var dbEntity = await _context.DatabaseTaskEntities
            .Include(t => t.Reminders)
            .Include(t => t.Attachments)
            .Include(t => t.DependenciesFrom)
            .Include(t => t.CustomRelationsFrom)
            .Include(t => t.CustomRelationsTo)
            .FirstOrDefaultAsync(t => t.Id == task.Id);

        if (dbEntity == null)
            throw new KeyNotFoundException($"Task with ID {task.Id} not found.");

        // Проверяем зависимости снаружи
        var dependentTasks = await _context.DatabaseTaskDependencyRelations
            .Where(r => r.ToTaskId == task.Id)
            .Select(r => r.FromTask)
            .ToListAsync();

        if (dependentTasks.Any())
        {
            var names = string.Join(", ", dependentTasks.Select(t => t.Title));
            throw new InvalidOperationException($"Can not delete '{dbEntity.Title}', because from it are dependent: {names}");
        }

        // 2. Удаляем агрегаты (EF каскадно удалит, если настроено, но мы можем явно подчистить)
        _context.DatabaseTaskReminders.RemoveRange(dbEntity.Reminders);
        _context.DatabaseTaskAttachments.RemoveRange(dbEntity.Attachments);
        _context.DatabaseTaskDependencyRelations.RemoveRange(dbEntity.DependenciesFrom);
        _context.DatabaseTaskCustomRelations.RemoveRange(dbEntity.CustomRelationsFrom);
        _context.DatabaseTaskCustomRelations.RemoveRange(dbEntity.CustomRelationsTo);

        // Важно: Labels не трогаем! Только связи на стороне Task останутся пустыми.

        // 3. Удаляем сам таск
        _context.DatabaseTaskEntities.Remove(dbEntity);

        // 4. Сохраняем
        await _context.SaveChangesAsync();
    }



    public async Task<List<TaskEntity>> GetAllAsync(Guid userId)
    {
        var dbEntities = await _context.DatabaseTaskEntities
            .Where(t => t.UserId == userId)
            .Include(t => t.Labels) // Загружаем Labels и связанные DatabaseTaskLabel
            .Include(t => t.Reminders) // Загружаем Reminders
            .Include(t => t.Attachments) // Загружаем Attachments
            .Include(t => t.DependenciesFrom) // Загружаем Dependencies
            .Include(t => t.CustomRelationsFrom)
            .Include(t => t.CustomRelationsTo) // Загружаем CustomRelations
            .ToListAsync();

        if (dbEntities == null || !dbEntities.Any())
            throw new KeyNotFoundException($"No tasks found for user ID {userId}."); // In tutorial exceptions in infrastructure is normal

        // Преобразуем в доменные сущности
        return dbEntities.Select(dbEntity => dbEntity.ToDomain()).ToList();
    }

    public async Task<TaskEntity> GetByIdAsync(Guid id)
    {
        var dbEntity = await _context.DatabaseTaskEntities
            .Include(t => t.Labels)  // Если нужно полные labels
            .Include(t => t.Reminders)
            .Include(t => t.Attachments)
            .Include(t => t.DependenciesFrom)
            .Include(t => t.CustomRelationsFrom)
            .Include(t => t.CustomRelationsTo)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (dbEntity == null)
            throw new KeyNotFoundException($"Task with ID {id} not found.");

        return dbEntity.ToDomain();
    }

    public async Task UpdateAsync(TaskEntity task)
    {
        // Load the tracked entity from DB
        var existingDbEntity = await _context.DatabaseTaskEntities
            .Include(t => t.Reminders)
            .Include(t => t.Attachments)
            .Include(t => t.DependenciesFrom)
            .Include(t => t.CustomRelationsFrom)
            .Include(t => t.CustomRelationsTo)
            .FirstOrDefaultAsync(t => t.Id == task.Id);

        if (existingDbEntity == null)
            throw new KeyNotFoundException($"Task with ID {task.Id} not found.");

        // Update scalar fields from domain entity
        var updatedDbEntity = task.ToDbEntity();
        _context.Entry(existingDbEntity).CurrentValues.SetValues(updatedDbEntity);

        var toAdd = updatedDbEntity.DependenciesFrom
            .Where(d => !existingDbEntity.DependenciesFrom
                .Any(e => e.FromTaskId == d.FromTaskId && e.ToTaskId == d.ToTaskId))
            .ToList();

        var toRemove = existingDbEntity.DependenciesFrom
            .Where(e => !updatedDbEntity.DependenciesFrom
                .Any(d => d.FromTaskId == e.FromTaskId && d.ToTaskId == e.ToTaskId))
            .ToList();

        // Удаляем старые зависимости
        _context.DatabaseTaskDependencyRelations.RemoveRange(toRemove);

        // Добавляем новые
        foreach (var d in toAdd)
        {
            existingDbEntity.DependenciesFrom.Add(d);
        }




        // Collections (Reminders, Attachments, Dependencies, CustomRelations) 
        // are updated inside the domain entity itself, so no need to clear/re-add here.

        await _context.SaveChangesAsync();
    }
    

    // FAST FIX. Don't do like that, it is Costili
    public async Task RemoveDependencyAsync(Guid taskId, Guid dependsOnTaskId)
    {
        var dependency = await _context.DatabaseTaskDependencyRelations
            .FirstOrDefaultAsync(d => d.FromTaskId == taskId && d.ToTaskId == dependsOnTaskId);

        if (dependency == null) return; // или выбросить ошибку

        _context.DatabaseTaskDependencyRelations.Remove(dependency);
        await _context.SaveChangesAsync();
    }



}