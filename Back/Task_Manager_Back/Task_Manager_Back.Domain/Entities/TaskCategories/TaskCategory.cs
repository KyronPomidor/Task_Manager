using Task_Manager_Back.Domain.Common;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.Entities.TaskCategories;

public abstract class TaskCategory
{
    public Guid Id { get; protected set; }
    public Guid UserId { get; protected set; }
    public string Title { get; protected set; } = string.Empty;
    public string? Description { get; protected set; }

    private readonly List<TaskCategory> _categories = new();
    private readonly List<TaskEntity> _tasks = new();

    public IReadOnlyCollection<TaskCategory> Categories => _categories.AsReadOnly();
    public IReadOnlyCollection<TaskEntity> Tasks => _tasks.AsReadOnly();

    protected TaskCategory(TaskCategoryCreateParams @params)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params.UserId));
        Title = ValidationHelper.ValidateStringField(@params.Title, 1, 100, nameof(@params.Title), "Title");
        Description = @params.Description;
    }

    protected TaskCategory() { }

    public virtual void Rename(string title)
    {
        Title = ValidationHelper.ValidateStringField(title, 1, 100, nameof(title), "Category name");
    }

    public virtual void UpdateDescription(string? description)
    {
        Description = description;
    }

    public void AddTask(TaskEntity task)
    {
        _tasks.Add(task);
    }

    /// <summary>
    /// Base LoadFromPersistence for all TaskCategory types
    /// </summary>
    protected static void LoadBaseFromPersistence(TaskCategory category, TaskCategoryState state)
    {
        category.Id = state.Id;
        category.UserId = state.UserId;
        category.Title = state.Title;
        category.Description = state.Description;
    }
}

/// Common params for creating any TaskCategory
public record TaskCategoryCreateParams(
    Guid UserId,
    string Title,
    string? Description
);

/// Common state for loading from persistence
public record TaskCategoryState(
    Guid Id,
    Guid UserId,
    string Title,
    string? Description
);
