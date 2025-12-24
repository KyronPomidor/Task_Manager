using Microsoft.EntityFrameworkCore;
using Task_Manager_Back.Infrastructure.DbContext;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Infrastructure.Repositories;

public class TaskCategoryRepository : ITaskCategoryRepository
{
    private readonly AppDbContext _dbContext;

    public TaskCategoryRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task CreateAsync(TaskCategory entity)
    {
        if (entity is TaskInbox)
        {
            // Optional: enforce only one inbox per user
            var existingInbox = await _dbContext.Categories
                .OfType<TaskInbox>()
                .FirstOrDefaultAsync(i => i.UserId == entity.UserId);

            if (existingInbox != null)
                throw new InvalidOperationException("Inbox already exists for this user");
        }

        await _dbContext.Categories.AddAsync(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(TaskCategory entity)
    {
        if (entity is TaskInbox)
            throw new InvalidOperationException("Inbox category cannot be deleted");

        _dbContext.Categories.Remove(entity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteByIdAsync(Guid entityId)
    {
        var category = await GetByIdAsync(entityId);
        await DeleteAsync(category);
    }

    public async Task<List<TaskCategory>> GetAllByUserIdAsync(Guid userId)
    {
        return await _dbContext.Categories
            .Where(c => c.UserId == userId)
            .ToListAsync();
    }

    public async Task<TaskCategory> GetByIdAsync(Guid entityId)
    {
        var category = await _dbContext.Categories
            .FirstOrDefaultAsync(c => c.Id == entityId);

        if (category == null)
            throw new InvalidOperationException("Category not found");

        return category;
    }

    public async Task UpdateAsync(TaskCategory entity)
    {
        if (entity is TaskInbox)
            throw new InvalidOperationException("Inbox category cannot be updated");

        _dbContext.Categories.Update(entity);
        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Gets the Inbox for a specific user. Creates it if it doesn't exist.
    /// </summary>
    public async Task<TaskInbox> GetOrCreateInboxByUserId(Guid userId)
    {
        var inbox = await _dbContext.Categories
            .OfType<TaskInbox>()
            .FirstOrDefaultAsync(i => i.UserId == userId);

        if (inbox != null) return inbox;

        // Create new inbox
        inbox = new TaskInbox(userId);
        await CreateAsync(inbox);
        return inbox;
    }
}
