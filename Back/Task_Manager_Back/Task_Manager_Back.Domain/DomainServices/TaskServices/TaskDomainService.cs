using System;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Domain.DomainServices.TaskServices;

public class TaskDomainService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IRelationTypeRepository _relationTypeRepository;

    public TaskDomainService(ITaskRepository repository, IRelationTypeRepository relationTypeRepository)
    {
        _taskRepository = repository;
        _relationTypeRepository = relationTypeRepository;
    }

    #region Public methods

    /// <summary>
    /// Adds a dependency from one task to another.
    /// Throws if adding would create a circular dependency.
    /// </summary>
    public async Task AddDependency(TaskEntity task, TaskEntity dependency)
    {
        if (await WouldCreateCycle(task.Id, dependency.Id))
            throw new InvalidOperationException("Cannot add dependency: would create a cycle.");

        task.AddDependency(new TaskDependencyRelation(task.Id, dependency.Id));
    }

    /// <summary>
    /// Marks a task as completed, enforcing dependency rules.
    /// </summary>
    public void MarkCompleted(TaskEntity task)
    {
        if (!task.IsActive())
            throw new InvalidOperationException("Cannot complete an inactive task.");

        // Check that all dependencies are completed
        foreach (var dep in task.Dependencies)
        {
            var dependencyTask = _taskRepository.GetByIdAsync(dep.ToTaskId);
            if (dependencyTask != null && !dependencyTask.IsCompleted)
                throw new InvalidOperationException("Cannot complete task: dependencies are not completed.");
        }

        task.MarkCompleted();
    }

    /// <summary>
    /// Marks a task as failed, enforcing rules.
    /// </summary>
    public void MarkFailed(TaskEntity task)
    {
        if (!task.IsActive())
            throw new InvalidOperationException("Cannot fail an inactive task.");

        // may add here checks fir deoendencies if needed
        task.MarkFailed();
    }

    /// <summary>
    /// Adds a custom relation from one task to another.
    /// </summary>
    public async Task AddCustomRelation(Guid fromTaskId, Guid toTaskId, Guid relationTypeId)
    {
        // Проверка на пустой Guid
        if (fromTaskId == Guid.Empty)
            throw new ArgumentException("fromTaskId cannot be empty", nameof(fromTaskId));
        if (toTaskId == Guid.Empty)
            throw new ArgumentException("toTaskId cannot be empty", nameof(toTaskId));
        if (relationTypeId == Guid.Empty)
            throw new ArgumentException("relationTypeId cannot be empty", nameof(relationTypeId));

        // Проверка существования задач
        var fromTask = await _taskRepository.GetByIdAsync(fromTaskId)
            ?? throw new InvalidOperationException("From task does not exist");
        var toTask = await _taskRepository.GetByIdAsync(toTaskId)
            ?? throw new InvalidOperationException("To task does not exist");

        // Проверка существования RelationType
        var relationType = _relationTypeRepository.GetByIdAsync(relationTypeId)
            ?? throw new InvalidOperationException("RelationType does not exist");

        // Создание связи
        var relation = new TaskCustomRelation(fromTaskId, toTaskId, relationTypeId);
        fromTask.AddCustomRelation(relation);
    }

    /// <summary>
    /// Removes a custom relation between tasks.
    /// </summary>
    public async Task DeleteCustomRelation(Guid fromTaskId, Guid toTaskId, Guid relationTypeId)
    {
        if (fromTaskId == Guid.Empty)
            throw new ArgumentException("fromTaskId cannot be empty", nameof(fromTaskId));
        if (toTaskId == Guid.Empty)
            throw new ArgumentException("toTaskId cannot be empty", nameof(toTaskId));
        if (relationTypeId == Guid.Empty)
            throw new ArgumentException("relationTypeId cannot be empty", nameof(relationTypeId));

        var fromTask = await _taskRepository.GetByIdAsync(fromTaskId)
            ?? throw new InvalidOperationException("From task does not exist");

        // Ensure that relation actually exists before removing
        if (!fromTask.HasCustomRelation(toTaskId, relationTypeId))
            throw new InvalidOperationException("The specified custom relation does not exist.");

        fromTask.RemoveCustomRelation(toTaskId, relationTypeId);
    }

    #endregion

    #region Private Helpers
    /// <summary>
    /// Checks if adding a dependency would create a circular reference.
    /// </summary>
    private async Task<bool> WouldCreateCycle(Guid fromTaskId, Guid toTaskId)
    {
        var visited = new HashSet<Guid>();
        return await CheckCycle(toTaskId, fromTaskId, visited);
    }

    // Optimize without recursion to avoid stack overflow on deep graphs
    // Here we use DFS with a stack
    // But for simplicity, we keep the recursive version

    private async Task<bool> CheckCycle(Guid currentTaskId, Guid targetTaskId, HashSet<Guid> visited)
    {
        if (visited.Contains(currentTaskId))
            return false; // already checked this path

        if (currentTaskId == targetTaskId)
            return true; // cycle detected

        visited.Add(currentTaskId);

        var currentTask = await _taskRepository.GetByIdAsync(currentTaskId);
        if (currentTask == null) return false;

        foreach (var dep in currentTask.Dependencies)
        {
            if (await CheckCycle(dep.ToTaskId, targetTaskId, visited))
                return true;
        }

        return false;
    }

    #endregion
}
