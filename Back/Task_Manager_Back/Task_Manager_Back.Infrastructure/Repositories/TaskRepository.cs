using Microsoft.EntityFrameworkCore;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Infrastructure.DbContext;

namespace Task_Manager_Back.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AppDbContext _dbContext;

    public TaskRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task CreateAsync(TaskEntity task)
    {
        await _dbContext.Tasks.AddAsync(task);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(TaskEntity task)
    {
        _dbContext.Tasks.Update(task);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(TaskEntity task)
    {
        _dbContext.Tasks.Remove(task);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(Guid entityId)
    {
        var task = await GetByIdAsync(entityId)
                   ?? throw new KeyNotFoundException($"Task with Id '{entityId}' not found.");
        _dbContext.Tasks.Remove(task);
        await _dbContext.SaveChangesAsync();
    }
    public async Task<TaskEntity> GetByIdAsync(Guid entityId)
    {
        var task = await _dbContext.Tasks
            .IncludeAll()
            .FirstOrDefaultAsync(t => t.Id == entityId);



        return task ?? throw new KeyNotFoundException($"Task with Id '{entityId}' not found.");
    }

    public async Task<List<TaskEntity>> GetAllByUserIdAsync(Guid userId)
    {
        var tasks = await _dbContext.Tasks
            .IncludeAll()
            .Where(t => t.UserId == userId)
            .ToListAsync();
        return tasks;
    }


    public async Task AddReminderAsync(Guid taskId, TaskReminder reminder)
    {
        var task = await GetByIdAsync(taskId) ?? throw new KeyNotFoundException("Task not found");
        task.AddReminder(reminder);
        await UpdateAsync(task);
    }

    public async Task RemoveReminderAsync(Guid taskId, Guid reminderId)
    {
        var task = await GetByIdAsync(taskId) ?? throw new KeyNotFoundException("Task not found");
        task.RemoveReminder(reminderId);
        await UpdateAsync(task);
    }

    public async Task AddTaskRelationAsync(Guid taskId, TaskRelation relation)
    {
        var task = await GetByIdAsync(taskId) ?? throw new KeyNotFoundException("Task not found");
        task.AddTaskRelation(relation);
        await UpdateAsync(task);
    }

    public async Task RemoveTaskRelationAsync(Guid taskId, Guid toTaskId)
    {
        var task = await GetByIdAsync(taskId) ?? throw new KeyNotFoundException("Task not found");
        task.RemoveTaskRelation(toTaskId);
        await UpdateAsync(task);
    }

    public async Task AddAttachmentAsync(Guid taskId, TaskAttachment attachment)
    {
        var task = await GetByIdAsync(taskId) ?? throw new KeyNotFoundException("Task not found");
        task.AddAttachment(attachment);
        await UpdateAsync(task);
    }

    public async Task RemoveAttachmentAsync(Guid taskId, Guid attachmentId)
    {
        var task = await GetByIdAsync(taskId) ?? throw new KeyNotFoundException("Task not found");
        task.RemoveAttachment(attachmentId);
        await UpdateAsync(task);
    }
    public async Task AddTaskLabelAsync(Guid taskId, TaskLabel label)
    {
        var task = await GetByIdAsync(taskId) ?? throw new KeyNotFoundException("Task not found");
        task.AddLabel(label);
        await UpdateAsync(task);
    }
    public async Task RemoveTaskLabel(Guid taskId, Guid labelId)
    {
        var task = await GetByIdAsync(taskId) ?? throw new KeyNotFoundException("Task not found");
        task.RemoveLabel(labelId);
        await UpdateAsync(task);
    }

}
public static class TaskQueryExtensions
{
    public static IQueryable<TaskEntity> IncludeAll(this IQueryable<TaskEntity> tasks)
    {
        return tasks
            .Include("Attachments")
            .Include("Reminders")
            .Include("TaskRelations")
            .Include("ShopItems")
            .Include("Labels");
    }
}