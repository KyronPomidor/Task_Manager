using System;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Entities.TaskEntity;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Domain.DomainServices.TaskServices;

public class TaskCategoryDomainService
{
    private readonly ITaskCategoryRepository _repository;

    public TaskCategoryDomainService(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    #region Public methods

    // Method to assign a parent category with circular reference check
    public async void AssignParent(CustomCategory category, Guid? newParentId)
    {
        if (newParentId == null)
        {
            category.SetParent(null);
            return;
        }

        // Load full ancestry chain of the new parent
        var ancestors = await GetAncestors(newParentId.Value);

        // TODO: CHECK in Load full ancestry chain of the new parent if parent exists
        // if not, throw exception
        // var newParent = _repository.GetById(newParentId.Value);
        // if (newParent == null)
        //    throw new InvalidOperationException("Parent category does not exist.");
        // This check can be done here or in GetAncestors method
        // But doing it here avoids unnecessary calls in GetAncestors if parent doesn't exist
        // So it's more efficient
        // However, it does mean we have to do one extra call here
        // Check if the current category is in the ancestor chain
        if (ancestors.Any(a => a.Id == category.Id))
            throw new InvalidOperationException("Cannot assign parent: circular reference detected.");

        category.SetParent(newParentId);
    }

    // Method to create a new CustomCategory with validation
    public async Task<CustomCategory> CreateCustomCategory(Guid userId, string title, string? description, Guid? parentCategoryId)
    {
        if (parentCategoryId != null)
        {
            var parent = await _repository.GetByIdAsync(parentCategoryId.Value);
            if (parent == null)
                throw new InvalidOperationException("Parent category does not exist.");
        }

        return new CustomCategory(userId, title, description, parentCategoryId);
    }

    #endregion

    #region Private Helpers
    private async Task<IEnumerable<TaskCategory>> GetAncestors(Guid categoryId)
    {
        var result = new List<TaskCategory>();
        var current = await _repository.GetByIdAsync(categoryId);

        while (current?.ParentCategoryId != null)
        {
            var parent = await _repository.GetByIdAsync(current.ParentCategoryId.Value);
            if (parent == null) break;
            result.Add(parent);
            current = parent;
        }

        return result;
    }
    #endregion

}