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

    // ----------------------
    // CREATE
    // ----------------------
    public async Task<Guid> CreateAsync(CustomCategory category)
    {
        if (category == null) throw new ArgumentNullException(nameof(category));

        var dbEntity = category.ToDbEntity();
        _context.DatabaseTaskCustomCategories.Add(dbEntity);
        await _context.SaveChangesAsync();
        if (category.Id != dbEntity.Id)
        {
            _logger.LogWarning("Mismatch between domain entity ID and DB entity ID after creation. Domain ID: {DomainId}, DB ID: {DbId}", category.Id, dbEntity.Id);
            throw new InvalidOperationException("Mismatch between domain entity ID and DB entity ID after creation.");
        } // Sync the ID back to the domain entity
        return dbEntity.Id;
    }

    // ----------------------
    // DELETE
    // ----------------------
    public async Task DeleteAsync(CustomCategory category)
    {
        if (category == null) throw new ArgumentNullException(nameof(category));

        var existing = await _context.DatabaseTaskCustomCategories
            .Include(c => c.SubCategories)
            .Include(c => c.Tasks)
            .FirstOrDefaultAsync(c => c.Id == category.Id);

        if (existing == null)
            throw new KeyNotFoundException($"Category with ID {category.Id} not found.");

        if (existing.SubCategories.Any())
            throw new InvalidOperationException("Cannot delete category with subcategories.");

        if (existing.Tasks.Any())
            throw new InvalidOperationException("Cannot delete category with assigned tasks.");

        _context.DatabaseTaskCustomCategories.Remove(existing);
        await _context.SaveChangesAsync();
    }

    // ----------------------
    // GET ALL BY USER
    // ----------------------
    public async Task<List<CustomCategory>> GetAllAsync(Guid userId)
    {
        var dbCategories = await _context.DatabaseTaskCustomCategories
            .Where(c => c.UserId == userId)
            .ToListAsync();

        return dbCategories.Select(c => c.ToDomain()).ToList();
    }

    public async Task<CustomCategory> GetByIdAsync(Guid id)
    {
        var dbCategory = await _context.DatabaseTaskCustomCategories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (dbCategory == null)
        {
            _logger.LogWarning("Category with ID {Id} not found", id);
            throw new KeyNotFoundException($"Category with ID {id} not found");
        }

        return dbCategory.ToDomain();
    }

    // ----------------------
    // UPDATE
    // ----------------------
    public async Task UpdateAsync(CustomCategory category)
    {
        if (category == null) throw new ArgumentNullException(nameof(category));

        var existing = await _context.DatabaseTaskCustomCategories
            .FirstOrDefaultAsync(c => c.Id == category.Id);

        if (existing == null)
            throw new KeyNotFoundException($"Category with ID {category.Id} not found.");

        // Update scalar properties
        existing.Title = category.Title;
        existing.Description = category.Description;
        existing.Order = category.Order;
        existing.ParentCategoryId = category.ParentCategoryId;

        await _context.SaveChangesAsync();
    }
}
