using Task_Manager_Back.Domain.Aggregates.ShoppingAggregate;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class TaskEntity
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public Guid StatusId { get; private set; }
    public Guid CategoryId { get; private set; }
    public DateTime? Deadline { get; private set; }
    public bool IsCompleted { get; private set; }
    public bool IsFailed { get; private set; }
    
    public List<TaskRelation>? TaskRelations { get; private set; }
    public TaskEntity(Guid userId, string title, string? description, Guid statusId, Guid categoryId, DateTime? deadline)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description;
        StatusId = statusId;
        CategoryId = categoryId;
        Deadline = deadline;
        IsCompleted = false;
        IsFailed = false;
    }

    // Бизнес-методы
    public void Rename(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
            throw new ArgumentException("Title cannot be empty", nameof(newTitle));
        Title = newTitle;
    }

    public void UpdateDescription(string? description)
    {
        Description = description;
    }

    public void ChangeStatus(Guid newStatusId)
    {
        StatusId = newStatusId;
    }

    public void ChangeCategory(Guid newCategoryId)
    {
        CategoryId = newCategoryId;
    }

    public void ChangeDeadline(DateTime? newDeadline)
    {
        if (newDeadline.HasValue && newDeadline.Value < DateTime.UtcNow)
            throw new InvalidOperationException("Deadline cannot be in the past");
        Deadline = newDeadline;
    }

    public void MarkCompleted()
    {
        if (IsCompleted) throw new InvalidOperationException("Task is already completed");
        if (IsFailed) throw new InvalidOperationException("Cannot complete a failed task");
        IsCompleted = true;
    }

    public void MarkFailed()
    {
        if (IsFailed) throw new InvalidOperationException("Task is already failed");
        if (IsCompleted) throw new InvalidOperationException("Cannot fail a completed task");
        IsFailed = true;
    }
    public void Delete()
    {

    }
    // Дополнительные методы
    public void AddAttachment(Attachment attachment) { /* логика */ }
    public void RemoveAttachment(Attachment attachment) { /* логика */ }
    public void AddReminder(Reminder reminder) { /* логика */ }
    public void AddShoppingItem(ShoppingItem item) { /* логика */ }
}