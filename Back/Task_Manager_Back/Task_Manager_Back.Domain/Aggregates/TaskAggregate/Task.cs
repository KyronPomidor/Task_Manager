using Task_Manager_Back.Domain.Aggregates.ShoppingAggregate;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class Task
{

    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public Guid StatusId { get; set; }
    public Guid CategoryId { get; set; }
    public DateTime? Deadline { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsFailed { get; set; }
    public Task(Guid userId, string title, string description, Guid statusId, Guid categoryId, DateTime deadline, bool isCompleted, bool isFailed)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description;
        StatusId = statusId;
        CategoryId = categoryId;
        Deadline = deadline;
        IsCompleted = isCompleted;
        IsFailed = isFailed;
    }

    public void MarkCompleted()
    {
        if (IsCompleted)
        {
            throw new InvalidOperationException("Task is already completed");
        }
        if (IsFailed)
        {
            throw new InvalidOperationException("Cannot complete a failed task");
        }
        IsCompleted = true;

    }
    public void MarkFailed()
    {
        if (IsFailed)
        {
            throw new InvalidOperationException("Task is already completed");
        }
        if (IsCompleted)
        {
            throw new InvalidOperationException("Cannot fail a completed task");
        }
        IsFailed = true;
    }
    public void ChangeCategory(Guid newCategoryId)
    {
        CategoryId = newCategoryId;
    }
    public void AddRelation(Task relatedTask)
    {

    }
    public void RemoveReltaion(Task relatedTask)
    {

    }
    public void AddAttachment(Attachment attachment)
    { 
        
    }
    public void RemoveAttachment(Attachment attachment)
    {

    }
    public void AddReminder(Reminder reminder)
    {

    }
    public void AddShoppingItem(ShoppingItem item)
    {

    }
}


