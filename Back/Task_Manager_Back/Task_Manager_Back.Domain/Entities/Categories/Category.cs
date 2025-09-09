using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.Entities.Categories;

public abstract class Category
{
    public Guid Id { get; protected set; }
    public Guid UserId { get; protected set; }

    private List<Category> _categories = new();
    private List<TaskEntity> _tasks = new();

    public IReadOnlyCollection<Category> Categories => _categories.AsReadOnly();
    public IReadOnlyCollection<TaskEntity> Tasks => _tasks.AsReadOnly();
    public Category(Guid userId)
    {
        Id = Guid.NewGuid();
        UserId = userId == Guid.Empty ? throw new ArgumentException("UserId required", nameof(userId)) : userId;
    }
    protected Category() { }

    public void AddTaskToCategory(TaskEntity task)
    {
        _tasks.Add(task);
    }
}
