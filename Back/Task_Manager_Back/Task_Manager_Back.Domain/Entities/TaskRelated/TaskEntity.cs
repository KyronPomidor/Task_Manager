using System.Drawing;
using System.Net.Mail;
using Task_Manager_Back.Domain.Common;
using Task_Manager_Back.Domain.Entities.Enums;
using Task_Manager_Back.Domain.Entities.ShopRelated;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskEntity
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid? StatusId { get; private set; }
    public Guid CategoryId { get; private set; }

    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public TaskPriority? Priority { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? Deadline { get; private set; }
    public string Color { get; private set; } = string.Empty;
    public bool? IsCompleted { get; private set; }
    public bool? IsFailed { get; private set; }
    public int PositionOrder { get; private set; }

    private List<TaskLabel> Labels { get; set; } = new();
    private List<TaskAttachment> Attachments { get; set; } = new();
    private List<TaskReminder> Reminders { get; set; } = new();
    private List<TaskRelation> TaskRelations { get; set; } = new();
    private List<ShopItem> ShopItems { get; set; } = new();

    public IReadOnlyList<TaskLabel> GetLabels() => Labels.AsReadOnly();
    public IReadOnlyList<TaskAttachment> GetAttachments() => Attachments.AsReadOnly();
    public IReadOnlyList<TaskReminder> GetReminders() => Reminders.AsReadOnly();
    public IReadOnlyList<TaskRelation> GetTaskRelations() => TaskRelations.AsReadOnly();
    public IReadOnlyList<ShopItem> GetShopItems() => ShopItems.AsReadOnly();

    public TaskEntity(TaskEntityCreateParams @params)
    {
        Id = Guid.NewGuid();

        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params.UserId));
        StatusId = @params.StatusId;
        Priority = @params.Priority;
        CategoryId = ValidationHelper.ValidateGuid(@params.CategoryId, nameof(@params.CategoryId));

        Title = ValidationHelper.ValidateStringField(@params.Title, 1, 100, nameof(@params.Title), "Title");
        Description = @params.Description;
        Color = ValidationHelper.ValidateHexColor(@params.Color, nameof(@params.Color));
        Deadline = @params.Deadline.HasValue
            ? ValidationHelper.ValidateNotPast(@params.Deadline.Value, nameof(@params.Deadline))
            : null;

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
            Color = state.Color,
            StatusId = state.StatusId,
            Priority = state.Priority,
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
    // add color methods
    public void Rename(string title) => Title = ValidationHelper.ValidateStringField(title, 1, 100, nameof(title), "Title");
    public void UpdateDescription(string? description) => Description = description;
    public void ChangeColor(string color) => Color = ValidationHelper.ValidateHexColor(color, nameof(color));
    public void ChangeStatus(Guid? statusId) => StatusId = statusId;
    public void ChangePriority(TaskPriority priority) => Priority = priority;
    public void ChangeCategory(Guid categoryId) => CategoryId = ValidationHelper.ValidateGuid(categoryId, nameof(categoryId));

    public void ChangeDeadline(DateTime? deadline)
    {
        if (deadline.HasValue)
            Deadline = ValidationHelper.ValidateNotPast(deadline.Value, nameof(deadline));
        else
            Deadline = null;
    }
    public void UpdatePositionOrder(int positionOrder) => PositionOrder = positionOrder;
    public void MarkCompleted()
    {
        if (IsCompleted.HasValue) throw new InvalidOperationException("Task is already completed");
        if (IsFailed.HasValue) throw new InvalidOperationException("Cannot complete a failed task");
        IsCompleted = true;
    }

    public void MarkFailed()
    {
        if (IsFailed.HasValue) throw new InvalidOperationException("Task is already failed");
        if (IsCompleted.HasValue) throw new InvalidOperationException("Cannot fail a completed task");
        IsFailed = true;
    }


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
        ArgumentNullException.ThrowIfNull(label);
        Labels.Add(label);
    }

    public void RemoveLabel(Guid labelId)
    {
        var label = Labels.Find(l => l.Id == labelId)
                   ?? throw new InvalidOperationException("TaskLabel not found");
        Labels.Remove(label);
    }
}

public record TaskEntityCreateParams(Guid UserId, string Title, string? Description, string Color, Guid? StatusId, TaskPriority? Priority, Guid CategoryId, DateTime? Deadline);
public record TaskEntityState(Guid Id, Guid UserId, string Title, string? Description, string Color, Guid? StatusId, TaskPriority? Priority, Guid CategoryId, DateTime? Deadline,
    bool? IsCompleted, bool? IsFailed, int PositionOrder,
    List<TaskAttachment> Attachments, List<TaskReminder> Reminders, List<TaskRelation> TaskRelations, List<ShopItem> ShopItems);
