using System.ComponentModel.DataAnnotations;
using Task_Manager_Back.Domain.Common;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.Entities.Categories;

public abstract class Category
{
    public Guid Id { get; protected set; }
    public Guid UserId { get; protected set; }
    public string Title { get; protected set; } = string.Empty;
    public string? Description { get; protected set; }

    private List<Category> _categories = new();
    private List<TaskEntity> _tasks = new();

    public IReadOnlyCollection<Category> Categories => _categories.AsReadOnly();
    public IReadOnlyCollection<TaskEntity> Tasks => _tasks.AsReadOnly();
    public Category(Guid userId, string title, string? description)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(userId, nameof(userId));
        Title = ValidationHelper.ValidateStringField(title, 1, 100, nameof(userId), "Title");
        Description = description;
    }
    protected Category() { }

    public void AddTaskCategory(TaskEntity task)
    {
        _tasks.Add(task);
    }
}
