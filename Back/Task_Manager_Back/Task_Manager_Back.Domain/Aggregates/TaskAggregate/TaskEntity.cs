using Task_Manager_Back.Domain.Aggregates.ShopAggregate;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class TaskEntity
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public Guid StatusId { get; private set; }
    public Guid PriorityId { get; private set; }
    public Guid CategoryId { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? Deadline { get; private set; }
    public bool IsCompleted { get; private set; }
    public bool IsFailed { get; private set; }

    private List<Attachment> Attachments { get; set; } = new();
    private List<Reminder> Reminders { get; set; } = new();
    private List<TaskRelation> TaskRelations { get; set; } = new();
    private List<ShopItem> ShopItems { get; set; } = new();

    public int Order { get; private set; }

    public TaskEntity(Guid userId, string title, string? description, Guid statusId, Guid priorityId, Guid categoryId, DateTime? deadline)
    {
        Id = Guid.NewGuid();
        UserId = userId == Guid.Empty ? throw new ArgumentException("UserId required", nameof(userId)) : userId;
        Title = string.IsNullOrWhiteSpace(title) || title.Length > 100
            ? throw new ArgumentException("Title must be 1-100 chars", nameof(title)) : title;
        Description = description;
        StatusId = statusId == Guid.Empty ? throw new ArgumentException("StatusId required", nameof(statusId)) : statusId;
        PriorityId = priorityId == Guid.Empty ? throw new ArgumentException("PriorityId required", nameof(priorityId)) : priorityId;
        CategoryId = categoryId == Guid.Empty ? throw new ArgumentException("CategoryId required", nameof(categoryId)) : categoryId;
        Deadline = deadline.HasValue && deadline.Value.Date >= DateTime.UtcNow.Date
            ? deadline
            : throw new ArgumentException("Deadline cannot be in the past", nameof(deadline));
        Order = 0;
    }
    private TaskEntity() { }
    public static TaskEntity LoadFromPersistence(Guid id, Guid userId, string title, string? description,
        Guid statusId, Guid priorityId, Guid categoryId, DateTime? deadline, bool isCompleted, bool isFailed,
        int order, List<Attachment> attachments, List<Reminder> reminders, List<TaskRelation> taskRelations, List<ShopItem> shopItems)
    {
        return new TaskEntity
        {
            Id = id,
            UserId = userId,
            Title = title,
            Description = description,
            StatusId = statusId,
            PriorityId = priorityId,
            CategoryId = categoryId,
            Deadline = deadline,
            IsCompleted = isCompleted,
            IsFailed = isFailed,
            Order = order,
            Attachments = attachments ?? new(),
            Reminders = reminders ?? new(),
            TaskRelations = taskRelations ?? new(),
            ShopItems = shopItems ?? new()
        };
    }

    public void Rename(string title)
    {
        Title = string.IsNullOrWhiteSpace(title) || title.Length > 100
            ? throw new ArgumentException("Title must be 1-100 chars", nameof(title)) : title;
    }

    public void UpdateDescription(string? description) => Description = description;

    public void ChangeStatus(Guid statusId)
    {
        StatusId = statusId == Guid.Empty
            ? throw new ArgumentException("StatusId required", nameof(statusId)) : statusId;
    }

    public void ChangePriority(Guid priorityId)
    {
        PriorityId = priorityId == Guid.Empty
            ? throw new ArgumentException("PriorityId required", nameof(priorityId)) : priorityId;
    }

    public void ChangeCategory(Guid categoryId)
    {
        CategoryId = categoryId == Guid.Empty
            ? throw new ArgumentException("CategoryId required", nameof(categoryId)) : categoryId;
    }

    public void ChangeDeadline(DateTime? deadline)
    {
        Deadline = deadline.HasValue && deadline.Value.Date >= DateTime.UtcNow.Date
            ? deadline : throw new ArgumentException("Deadline cannot be in the past", nameof(deadline));
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

    public void UpdateOrder(int order) => Order = order;

    public void AddAttachment(Guid userId, string filePath, string fileType, long size)
    {
        var attachment = new Attachment(userId, filePath, fileType, size);
        Attachments.Add(attachment);
    }

    public void RemoveAttachment(Guid attachmentId)
    {
        var attachment = Attachments.Find(a => a.Id == attachmentId)
            ?? throw new InvalidOperationException("Attachment not found");
        Attachments.Remove(attachment);
    }

    public void AddReminder(Guid userId, DateTime time, string message)
    {
        var reminder = new Reminder(Id, userId, time, message);
        Reminders.Add(reminder);
    }

    public void RemoveReminder(Guid reminderId)
    {
        var reminder = Reminders.Find(r => r.Id == reminderId)
            ?? throw new InvalidOperationException("Reminder not found");
        Reminders.Remove(reminder);
    }

    public void AddTaskRelation(Guid toTaskId)
    {
        var relation = new TaskRelation(Id, toTaskId);
        TaskRelations.Add(relation);
    }

    public void RemoveTaskRelation(Guid toTaskId)
    {
        var relation = TaskRelations.Find(r => r.ToTaskId == toTaskId)
            ?? throw new InvalidOperationException("TaskRelation not found");
        TaskRelations.Remove(relation);
    }

    public void AddShopItem(string name, double amount, double? price, Guid? productCategoryId)
    {
        var shopItem = new ShopItem(name, amount, price, productCategoryId);
        ShopItems.Add(shopItem);
    }

    public void RemoveShopItem(Guid shopItemId)
    {
        var shopItem = ShopItems.Find(s => s.Id == shopItemId)
            ?? throw new InvalidOperationException("ShopItem not found");
        ShopItems.Remove(shopItem);
    }

    public void UpdateShopItem(Guid shopItemId, string? name, double? amount, double? price, Guid? productCategoryId)
    {
        var shopItem = ShopItems.Find(s => s.Id == shopItemId)
            ?? throw new InvalidOperationException("ShopItem not found");
        if (name != null) shopItem.UpdateName(name);
        if (amount.HasValue) shopItem.UpdateAmount(amount.Value);
        if (price != null) shopItem.UpdatePrice(price);
        shopItem.UpdateProductCategory(productCategoryId);
    }

    public void Delete()
    {
        /* логика */
    }

    // Expose read-only collections for querying
    public IReadOnlyList<Attachment> GetAttachments() => Attachments.AsReadOnly();
    public IReadOnlyList<Reminder> GetReminders() => Reminders.AsReadOnly();
    public IReadOnlyList<TaskRelation> GetTaskRelations() => TaskRelations.AsReadOnly();
    public IReadOnlyList<ShopItem> GetShopItems() => ShopItems.AsReadOnly();
}
