using Task_Manager_Back.Domain.Common;
using Task_Manager_Back.Domain.Entities.Enums;
using Task_Manager_Back.Domain.Entities.ShopRelated;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskEntity
{
    public Guid Id { get; private set; }    // <- PK
    public Guid UserId { get; private set; } // <- FK to User
    public Guid? StatusId { get; private set; } // <- FK to Status (list of statuses is user-specific)
    public Guid CategoryId { get; private set; } // <- FK to Category (categories are user-specific)

    public string Title { get; private set; } = string.Empty; // <- max length 100
    public string? Description { get; private set; } // <- optional, no length limit
    public TaskPriority? Priority { get; private set; } // <- optional, enum
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow; // <- set on creation
    public DateTime? Deadline { get; private set; } // <- optional
    public string Color { get; private set; } = string.Empty; // <- hex color code, e.g. #FFFFFF
    public bool? IsCompleted { get; private set; } // <- null/false = not completed, true = completed
    public bool? IsFailed { get; private set; } // <- null/false = not failed, true = failed
    public int PositionOrder { get; private set; } // <- order in the list, lower number = higher position

    private List<TaskLabel> Labels { get; set; } = new(); // aggrigate lables here. TaskLabel has FK to TaskEntity
                                                          // it is a problem. It should be  like a Priority, should be user-specific. 
    
    private List<TaskAttachment> Attachments { get; set; } = new(); // aggrigate attachments here. TaskAttachment has FK to TaskEntity
                                                                    // files can be located only inside some tasks. It is good here. If task is deleted, attachments are deleted too. 
    private List<TaskReminder> Reminders { get; set; } = new(); // aggrigate reminders here. TaskReminder has FK to TaskEntity
                                                                // it is good here. If task is deleted, reminders are deleted too.
                                                                // However, I don't understand how reminders should work! Isn't the info about the deadline enough?
    private List<TaskRelation> TaskRelations { get; set; } = new(); // aggrigate task relations here. TaskRelation has FK to TaskEntity
                                                                // it is good here. If task is deleted, relations are deleted too.
    private List<ShopItem> ShopItems { get; set; } = new(); // aggrigate shop items here. ShopItem has FK to TaskEntity
                                                            // it is good here. If task is deleted, shop items are deleted too.
                                                            // However, In the future will need improvement here. 

    public IReadOnlyList<TaskLabel> GetLabels() => Labels.AsReadOnly(); // exposing labels as read-only list
    public IReadOnlyList<TaskAttachment> GetAttachments() => Attachments.AsReadOnly(); // exposing attachments as read-only list
    public IReadOnlyList<TaskReminder> GetReminders() => Reminders.AsReadOnly(); // exposing reminders as read-only list
    public IReadOnlyList<TaskRelation> GetTaskRelations() => TaskRelations.AsReadOnly(); // exposing task relations as read-only list
    public IReadOnlyList<ShopItem> GetShopItems() => ShopItems.AsReadOnly(); // exposing shop items as read-only list

    public TaskEntity(TaskEntityCreateParams @params) // constructor for creating new TaskEntity
    {
        Id = Guid.NewGuid(); // new GUID on creation

        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params.UserId)); // FK to User
        StatusId = @params.StatusId; // can be null. Good here. 
        Priority = @params.Priority; // can be null. Good here.
        CategoryId = ValidationHelper.ValidateGuid(@params.CategoryId, nameof(@params.CategoryId)); // FK to Category. Required. 

        Title = ValidationHelper.ValidateStringField(@params.Title, 1, 100, nameof(@params.Title), "Title"); // Required, max length 100
        Description = @params.Description; // optional, no length limit (in the future should put some limit, for security reasons)
        Color = ValidationHelper.ValidateHexColor(@params.Color, nameof(@params.Color)); // Required, hex color code. In the future should be optional and if not provided, should be generated randomly. The list of all colors should be stored somewhere in order to prevent duplicates.
        Deadline = @params.Deadline.HasValue // optional
            ? ValidationHelper.ValidateNotPast(@params.Deadline.Value, nameof(@params.Deadline))
            : null;

        PositionOrder = 0; // default position order, should be set later by the service. It is unclear for now how it will work. It is done for user-specigic order without sorting. 
    }


    private TaskEntity() { } // for EFC. The Database Entities are not used here and EFC uses directly the domain Entities. Need to fix. 

    public static TaskEntity LoadFromPersistence(TaskEntityState state) // for loading from DB. Should be for EFC only, for mapper, it to use the database entities, not the domain entities.
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

    public void Delete() // cascading delete
    {
        Attachments.Clear(); // good

        Reminders.Clear(); // good

        TaskRelations.Clear(); // good

        ShopItems.Clear(); // good

        // Labels.Clear(); // now Lables are aggregate and are deleted by default, but need to switch to FK, like the Status. 
    }
    // add color methods
    public void Rename(string title) => Title = ValidationHelper.ValidateStringField(title, 1, 100, nameof(title), "Title"); // max length 100
    public void UpdateDescription(string? description) => Description = description; // no length limit, can be null
    public void ChangeColor(string color) => Color = ValidationHelper.ValidateHexColor(color, nameof(color)); // hex color code
    public void ChangeStatus(Guid? statusId) => StatusId = statusId; // can be null
    public void ChangePriority(TaskPriority priority) => Priority = priority; // can be null
    public void ChangeCategory(Guid categoryId) => CategoryId = ValidationHelper.ValidateGuid(categoryId, nameof(categoryId)); // cannot be null

    public void ChangeDeadline(DateTime? deadline) // can be null
    {
        if (deadline.HasValue)
            Deadline = ValidationHelper.ValidateNotPast(deadline.Value, nameof(deadline));
        else
            Deadline = null;
    }
    public void UpdatePositionOrder(int positionOrder) => PositionOrder = positionOrder; // non-negative integer, no validation here, should be done in service (service? Every catefory has its own list of tasks, so the order is user-specific and category-specific. How to implement it? Maybe a separate entity for storing the order of tasks in categories for each user? No. Maybe just a list of task IDs in the category entity? No, because the order is user-specific. Maybe a separate entity for storing the order of tasks for each user? No, too complicated. Maybe just a simple integer field in the TaskEntity? Yes, but how to ensure that the order is unique within a category for a user? Maybe just let it be non-unique and handle it in the service? Yes, for now. In the servie when creating a new task in a category, set its order to the max order + 1 in that category for that user. When changing the order, just set the new order and let the service handle the rest. Yes, for now. In the future, maybe implement a more sophisticated ordering system if needed.)
    public void MarkCompleted() // mark as completed
    {
        if (IsCompleted.HasValue) throw new InvalidOperationException("Task is already completed");
        if (IsFailed.HasValue) throw new InvalidOperationException("Cannot complete a failed task");
        IsCompleted = true;
    }

    public void MarkFailed() // mark as failed
    {
        if (IsFailed.HasValue) throw new InvalidOperationException("Task is already failed");
        if (IsCompleted.HasValue) throw new InvalidOperationException("Cannot fail a completed task");
        IsFailed = true;
    }


    public void AddAttachment(TaskAttachment attachment) // add attachment
    {
        ArgumentNullException.ThrowIfNull(attachment);
        Attachments.Add(attachment);
    }

    public void RemoveAttachment(Guid attachmentId) // remove attachment
    {
        var attachment = Attachments.Find(a => a.Id == attachmentId)
                         ?? throw new InvalidOperationException("TaskAttachment not found");
        Attachments.Remove(attachment);
    }

    public void AddReminder(TaskReminder reminder) // add reminder
    {
        ArgumentNullException.ThrowIfNull(reminder);
        Reminders.Add(reminder);
    }

    public void RemoveReminder(Guid reminderId) // remove reminder
    {
        var reminder = Reminders.Find(r => r.Id == reminderId)
                       ?? throw new InvalidOperationException("Reminder not found");
        Reminders.Remove(reminder);
    }

    public void AddTaskRelation(TaskRelation relation) // add task relation
    {
        ArgumentNullException.ThrowIfNull(relation);
        TaskRelations.Add(relation);
    }

    public void RemoveTaskRelation(Guid toTaskId) // remove task relation
    {
        var relation = TaskRelations.Find(r => r.ToTaskId == toTaskId)
                       ?? throw new InvalidOperationException("TaskRelation not found");
        TaskRelations.Remove(relation);
    }

    public void AddShopItem(ShopItem item) // add shop item
    {
        ArgumentNullException.ThrowIfNull(item);
        ShopItems.Add(item);
    }

    public void RemoveShopItem(Guid shopItemId) // remove shop item
    {
        var item = ShopItems.Find(s => s.Id == shopItemId)
                   ?? throw new InvalidOperationException("ShopItem not found");
        ShopItems.Remove(item);
    }

    public void AddLabel(TaskLabel label) // add label, should be done like the status. list of FK's. Not as aggrigate. 
    {
        ArgumentNullException.ThrowIfNull(label);
        Labels.Add(label);
    }

    public void RemoveLabel(Guid labelId) // remove label, should be done like the status. list of FK's. Not as aggrigate.
    {
        var label = Labels.Find(l => l.Id == labelId)
                   ?? throw new InvalidOperationException("TaskLabel not found");
        Labels.Remove(label);
    }
}

public record TaskEntityCreateParams(Guid UserId, string Title, string? Description, string Color, Guid? StatusId, TaskPriority? Priority, Guid CategoryId, DateTime? Deadline); // creation parameters. For some reason somebody decided to use params and not to pass them directly to the constructor.
public record TaskEntityState(Guid Id, Guid UserId, string Title, string? Description, string Color, Guid? StatusId, TaskPriority? Priority, Guid CategoryId, DateTime? Deadline, // same as above, but for EFC. 
    bool? IsCompleted, bool? IsFailed, int PositionOrder,
    List<TaskAttachment> Attachments, List<TaskReminder> Reminders, List<TaskRelation> TaskRelations, List<ShopItem> ShopItems);
