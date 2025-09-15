using Task_Manager_Back.Domain.Common;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.Entities.Categories;

public abstract class TaskCategory
{
    public Guid Id { get; protected set; }
    public Guid UserId { get; protected set; }
    public string Title { get; protected set; } = string.Empty;
    public string? Description { get; protected set; }
    public int Order { get; protected set; }

    private readonly List<TaskCategory> _categories = new();
    private readonly List<TaskEntity> _tasks = new();

    public IReadOnlyCollection<TaskCategory> Categories => _categories.AsReadOnly();
    public IReadOnlyCollection<TaskEntity> Tasks => _tasks.AsReadOnly();

    protected TaskCategory(Guid userId, string title, string? description)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(userId, nameof(userId));
        Title = ValidationHelper.ValidateStringField(title, 1, 100, nameof(title), "Title");
        Description = description;
        Order = 0;
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

    public virtual void UpdateOrder(int order)
    {
        Order = order;
    }

    public void AddTask(TaskEntity task)
    {
        _tasks.Add(task);
    }
}
