using Task_Manager_Back.Domain.Common;
using Task_Manager_Back.Domain.Entities.ShopRelated;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskEntity
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid StatusId { get; private set; }
    public Guid PriorityId { get; private set; }
    public Guid CategoryId { get; private set; }

    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? Deadline { get; private set; }
    public bool IsCompleted { get; private set; }
    public bool IsFailed { get; private set; }
    public int PositionOrder { get; private set; }

    private List<TaskLabel> Labels { get; set; } = new();
    private List<TaskAttachment> Attachments { get; set; } = new();
    private List<TaskReminder> Reminders { get; set; } = new();
    private List<TaskRelation> TaskRelations { get; set; } = new();
    private List<ShopItem> ShopItems { get; set; } = new();

    public IReadOnlyList<TaskAttachment> GetAttachments() => Attachments.AsReadOnly();
    public IReadOnlyList<TaskReminder> GetReminders() => Reminders.AsReadOnly();
    public IReadOnlyList<TaskRelation> GetTaskRelations() => TaskRelations.AsReadOnly();
    public IReadOnlyList<ShopItem> GetShopItems() => ShopItems.AsReadOnly();

    public TaskEntity(TaskEntityCreateParams @params)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params));
        StatusId = ValidationHelper.ValidateGuid(@params.StatusId, nameof(@params));
        PriorityId = ValidationHelper.ValidateGuid(@params.PriorityId, nameof(@params));
        CategoryId = ValidationHelper.ValidateGuid(@params.CategoryId, nameof(@params));
        Title = ValidationHelper.ValidateStringField(@params.Title, 1, 100, nameof(@params), "Title");
        Description = @params.Description;
        Deadline = @params.Deadline.HasValue ? ValidationHelper.ValidateNotPast(@params.Deadline.Value, nameof(@params)) : null;
        PositionOrder = 0;
    }

    private TaskEntity() { }

    public static TaskEntity LoadFromPersistence(TaskEntityState state)
    {
        return new TaskEntity
        {
            Id = state.Id,
            UserId = state.UserId,
            Title = state.Title,
            Description = state.Description,
            StatusId = state.StatusId,
            PriorityId = state.PriorityId,
            CategoryId = state.CategoryId,
            Deadline = state.Deadline,
            IsCompleted = state.IsCompleted,
            IsFailed = state.IsFailed,
            PositionOrder = state.PositionOrder,
            Attachments = state.Attachments ?? new(),
            Reminders = state.Reminders ?? new(),
            TaskRelations = state.TaskRelations ?? new(),
            ShopItems = state.ShopItems ?? new()
        };
    }

    public void Delete()
    {
        Attachments.Clear();

        Reminders.Clear();

        TaskRelations.Clear();

        ShopItems.Clear();
    }

    public void Rename(string title) => Title = ValidationHelper.ValidateStringField(title, 1, 100, nameof(title), "Title");
    public void UpdateDescription(string? description) => Description = description;

    public void ChangeStatus(Guid statusId) => StatusId = ValidationHelper.ValidateGuid(statusId, nameof(statusId));
    public void ChangePriority(Guid priorityId) => PriorityId = ValidationHelper.ValidateGuid(priorityId, nameof(priorityId));
    public void ChangeCategory(Guid categoryId) => CategoryId = ValidationHelper.ValidateGuid(categoryId, nameof(categoryId));

    public void ChangeDeadline(DateTime? deadline)
    {
        if (deadline.HasValue)
            Deadline = ValidationHelper.ValidateNotPast(deadline.Value, nameof(deadline));
        else
            Deadline = null;
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

    public void UpdatePositionOrder(int positionOrder) => PositionOrder = positionOrder;
    public void AddAttachment(TaskAttachment attachment)
    {
        ArgumentNullException.ThrowIfNull(attachment);
        Attachments.Add(attachment);
    }

    public void RemoveAttachment(Guid attachmentId)
    {
        var attachment = Attachments.Find(a => a.Id == attachmentId)
                         ?? throw new InvalidOperationException("TaskAttachment not found");
        Attachments.Remove(attachment);
    }

    public void AddReminder(TaskReminder reminder)
    {
        ArgumentNullException.ThrowIfNull(reminder);
        Reminders.Add(reminder);
    }

    public void RemoveReminder(Guid reminderId)
    {
        var reminder = Reminders.Find(r => r.Id == reminderId)
                       ?? throw new InvalidOperationException("Reminder not found");
        Reminders.Remove(reminder);
    }

    public void AddTaskRelation(TaskRelation relation)
    {
        ArgumentNullException.ThrowIfNull(relation);
        TaskRelations.Add(relation);
    }

    public void RemoveTaskRelation(Guid toTaskId)
    {
        var relation = TaskRelations.Find(r => r.ToTaskId == toTaskId)
                       ?? throw new InvalidOperationException("TaskRelation not found");
        TaskRelations.Remove(relation);
    }

    public void AddShopItem(ShopItem item)
    {
        ArgumentNullException.ThrowIfNull(item);
        ShopItems.Add(item);
    }

    public void RemoveShopItem(Guid shopItemId)
    {
        var item = ShopItems.Find(s => s.Id == shopItemId)
                   ?? throw new InvalidOperationException("ShopItem not found");
        ShopItems.Remove(item);
    }

    public void AddLabel(TaskLabel label)
    {
        if (label == null) throw new ArgumentNullException(nameof(label));
        Labels.Add(label);
    }

    public void RemoveLabel(Guid labelId)
    {
        var label = Labels.Find(l => l.Id == labelId)
                   ?? throw new InvalidOperationException("TaskLabel not found");
        Labels.Remove(label);
    }
}

public record TaskEntityCreateParams(Guid UserId, string Title, string? Description, Guid StatusId, Guid PriorityId, Guid CategoryId, DateTime? Deadline);
public record TaskEntityState(Guid Id, Guid UserId, string Title, string? Description, Guid StatusId, Guid PriorityId, Guid CategoryId, DateTime? Deadline,
    bool IsCompleted, bool IsFailed, int PositionOrder,
    List<TaskAttachment> Attachments, List<TaskReminder> Reminders, List<TaskRelation> TaskRelations, List<ShopItem> ShopItems);
