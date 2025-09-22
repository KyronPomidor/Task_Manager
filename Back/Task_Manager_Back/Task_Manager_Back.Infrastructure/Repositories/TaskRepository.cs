using System;
using Microsoft.EntityFrameworkCore;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;
using Task_Manager_Back.Infrastructure.DbContext;
using Task_Manager_Back.Infrastructure.Mappers;

namespace Task_Manager_Back.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _context;

    public TaskRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TaskEntity> CreateAsync(TaskEntity task)
    {
        var dbEntity = task.ToDbEntity();
        _context.Tasks.Add(dbEntity);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task UpdateAsync(TaskEntity task)
    {
        var dbEntity = await _context.Tasks
            .Include(t => t.Labels)
            .Include(t => t.Reminders)
            .Include(t => t.Attachments)
            .Include(t => t.Dependencies)
            .Include(t => t.CustomRelations)
            .FirstOrDefaultAsync(t => t.Id == task.Id);

        if (dbEntity == null)
            throw new InvalidOperationException("Task not found");

        // Обновляем все поля через mapper
        var updatedEntity = task.ToDbEntity();

        _context.Entry(dbEntity).CurrentValues.SetValues(updatedEntity);

        // Обновляем связанные коллекции вручную
        dbEntity.Labels = updatedEntity.Labels;
        dbEntity.Reminders = updatedEntity.Reminders;
        dbEntity.Attachments = updatedEntity.Attachments;
        dbEntity.Dependencies = updatedEntity.Dependencies;
        dbEntity.CustomRelations = updatedEntity.CustomRelations;

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(TaskEntity task)
    {
        var dbEntity = await _context.Tasks.FindAsync(task.Id);
        if (dbEntity == null)
            throw new InvalidOperationException("Task not found");

        _context.Tasks.Remove(dbEntity);
        await _context.SaveChangesAsync();
    }

    public async Task<TaskEntity?> GetByIdAsync(Guid id)
    {
        var dbEntity = await _context.Tasks
            .Include(t => t.Labels)
            .Include(t => t.Reminders)
            .Include(t => t.Attachments)
            .Include(t => t.Dependencies)
            .Include(t => t.CustomRelations)
            .FirstOrDefaultAsync(t => t.Id == id);

        return dbEntity?.ToDomain();
    }

    public async Task<List<TaskEntity?>> GetAllAsync(Guid userId)
    {
        var dbEntities = await _context.Tasks
            .Where(t => t.UserId == userId)
            .Include(t => t.Labels)
            .Include(t => t.Reminders)
            .Include(t => t.Attachments)
            .Include(t => t.Dependencies)
            .Include(t => t.CustomRelations)
            .ToListAsync();

        return dbEntities.Select(d => d.ToDomain()).ToList();
    }

    Task ITaskRepository.CreateAsync(TaskEntity task)
    {
        return CreateAsync(task);
    }
}