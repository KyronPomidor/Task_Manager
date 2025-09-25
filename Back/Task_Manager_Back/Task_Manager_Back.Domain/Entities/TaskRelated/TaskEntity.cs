using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Common;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

//TODO: add params back
public class TaskEntity
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; } // Assuming tasks are associated with users
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public string Color { get; private set; } // uniquiness is enforces in service layer, if needed

    public bool IsCompleted { get; private set; }
    public bool IsFailed { get; private set; }
    public Guid? PriorityId { get; private set; }
    public int PriorityLevel { get; private set; } // TEMP FIELD
    public Guid? StatusId { get; private set; }
    public Guid? CategoryId { get; private set; } // Null means Inbox. Bad practice, but fast.

    // Labels
    private List<Guid> _labelIds = new();
    public IReadOnlyList<Guid> LabelIds => _labelIds.AsReadOnly();

    public DateTime? CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; } // idk if I need this
    public DateTime? Deadline { get; private set; } // nullable, as not all tasks have deadlines
    public DateTime? CompletedAt { get; private set; } // nullable, as not all tasks are completed
    public DateTime? FailedAt { get; private set; }

    private readonly List<TaskReminder> _reminders = new List<TaskReminder>();
    private readonly List<TaskAttachment> _attachments = new List<TaskAttachment>(); // aggrigate attachments here. TaskAttachment has FK to TaskEntity
                                                                                     // files can be located only inside some tasks. It is good here. If task is deleted, attachments are deleted too. 
    private readonly List<TaskDependencyRelation> _dependencies = new List<TaskDependencyRelation>();
    private readonly List<TaskCustomRelation> _customRelations = new List<TaskCustomRelation>();

    public IReadOnlyCollection<TaskReminder> Reminders => _reminders.AsReadOnly();
    public IReadOnlyCollection<TaskAttachment> Attachments => _attachments.AsReadOnly();
    public IReadOnlyCollection<TaskDependencyRelation> Dependencies => _dependencies.AsReadOnly();
    public IReadOnlyCollection<TaskCustomRelation> CustomRelations => _customRelations.AsReadOnly();

    // For UI ordering among siblings
    public int PositionOrder { get; private set; } // handle in service layer to avoid conflicts

    public TaskEntity(TaskEntityCreateParams @params)
    {
        Id = Guid.NewGuid();
        UserId = @params.userId;
        Title = !string.IsNullOrWhiteSpace(@params.title)
            ? @params.title
            : throw new ArgumentNullException(nameof(@params.title));
        Description = @params.description;

        PriorityId = @params.priorityId;
        PriorityLevel = @params.priorityLevel; // TEMP FIELD
        StatusId = @params.statusId;
        CategoryId = @params.categoryId; // Null means Inbox

        Deadline = @params.deadline;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;

        CompletedAt = null;
        FailedAt = null;
        IsCompleted = false;
        IsFailed = false;

        if (@params.labels != null)
            _labelIds = @params.labels.ToList();

        PositionOrder = @params.order;
        //ChangeColor(color); // why not to use already existing method?
        // uniquiness of color is enforced in service layer, if needed
        //TODO: handle in service layer to uniqyen colors
        Color = ValidationHelper.ValidateHexColor(@params.color, nameof(@params.color));
        // was warning that color field is uninitialized, so I initialized it here

        // consider in future using existing methods in constructor, hehe
    }

    internal void MarkCompleted()
    {
        if (IsFailed)
            throw new InvalidOperationException("Cannot complete a failed task.");

        if (IsCompleted)
            throw new InvalidOperationException("Task is already completed.");

        IsCompleted = true;
        CompletedAt = DateTime.UtcNow;
    }

    internal void MarkFailed()
    {
        if (IsCompleted)
            throw new InvalidOperationException("Cannot fail a completed task.");

        if (IsFailed)
            throw new InvalidOperationException("Task is already failed.");

        IsFailed = true;
        FailedAt = DateTime.UtcNow;
    }

    internal void AddDependency(TaskDependencyRelation dep)
    {
        _dependencies.Add(dep);
    }

    internal void RemoveDependency(Guid dependencyTaskId)
    {
        var dep = _dependencies.FirstOrDefault(d => d.ToTaskId == dependencyTaskId);
        if (dep != null)
            _dependencies.Remove(dep);
    }

    internal void AddCustomRelation(TaskCustomRelation relation)
    {
        _customRelations.Add(relation);
    }

    internal void RemoveCustomRelation(Guid toTaskId, Guid relationTypeId)
    {
        var rel = _customRelations.FirstOrDefault(r => r.ToTaskId == toTaskId && r.RelationTypeId == relationTypeId);
        if (rel != null)
            _customRelations.Remove(rel);
    }

    // --- Update Methods ---
    public void Rename(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
            throw new ArgumentNullException(nameof(newTitle), "Title cannot be empty.");

        Title = newTitle;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDescription(string? newDescription)
    {
        Description = newDescription;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangePriority(Guid newPriorityId)
    {
        PriorityId = newPriorityId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeStatus(Guid? newStatusId)
    {
        if (newStatusId == null && IsCompleted)
            throw new InvalidOperationException("Cannot set status to null for a completed task.");
        StatusId = newStatusId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeCategory(Guid newCategoryId)
    {
        CategoryId = newCategoryId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void ChangeDeadline(DateTime? newDeadline)
    {
        Deadline = newDeadline;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Reorder(int newOrder)
    {
        PositionOrder = newOrder;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddLabel(Guid labelId)
    {
        if (!_labelIds.Contains(labelId))
        {
            _labelIds.Add(labelId);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void RemoveLabel(Guid labelId)
    {
        if (_labelIds.Remove(labelId))
            UpdatedAt = DateTime.UtcNow;
    }

    public bool HasLabel(Guid labelId)
    {
        return _labelIds.Contains(labelId);
    }

    public void ClearLabels()
    {
        if (_labelIds.Any())
        {
            _labelIds.Clear();
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public bool HasDependency(Guid taskId)
    {
        return _dependencies.Any(d => d.ToTaskId == taskId);
    }

    public bool HasCustomRelation(Guid taskId, Guid relationTypeId)
    {
        return _customRelations.Any(r => r.ToTaskId == taskId && r.RelationTypeId == relationTypeId);
    }

    public IEnumerable<Guid> GetAllRelatedTaskIds()
    {
        return _dependencies.Select(d => d.ToTaskId)
            .Concat(_customRelations.Select(r => r.ToTaskId))
            .Distinct();
    }
    public bool IsOverdue()
    {
        return Deadline.HasValue && !IsCompleted && DateTime.UtcNow > Deadline.Value;
    }
    public bool IsActive()
    {
        return !IsCompleted && !IsFailed;
        //return !(IsCompleted || IsFailed);
    }

    public void ChangeColor(string color) => Color = ValidationHelper.ValidateHexColor(color, nameof(color)); // hex color code

    public void AddAttachment(TaskAttachment attachment) // add attachment
    {
        ArgumentNullException.ThrowIfNull(attachment);
        _attachments.Add(attachment);
    }

    public void RemoveAttachment(Guid attachmentId) // remove attachment
    {
        var attachment = _attachments.Find(a => a.Id == attachmentId)
                         ?? throw new InvalidOperationException("TaskAttachment not found");
        _attachments.Remove(attachment);
    }

    public void AddReminder(TaskReminder reminder)
    {
        ArgumentNullException.ThrowIfNull(reminder);
        _reminders.Add(reminder);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveReminder(Guid reminderId)
    {
        var reminder = _reminders.FirstOrDefault(r => r.Id == reminderId)
                    ?? throw new InvalidOperationException("TaskReminder not found");
        _reminders.Remove(reminder);
        UpdatedAt = DateTime.UtcNow;
    }

    public void Delete()
    {
        // Очистка всех внутренних коллекций
        _reminders.Clear();
        _attachments.Clear();
        _dependencies.Clear();
        _customRelations.Clear();
        _labelIds.Clear();
        // this clearing doesn't make any sense here, because the entity will be deleted anyway, but whatever

        // Можно добавить дополнительную логику:
        // - проверка, можно ли удалять задачу
        // - уведомление других сервисов о удалении
        UpdatedAt = DateTime.UtcNow;
    }
    // to lazy to read this, but I hope it will work

    public void AssignToCategory(Guid categoryId){ //normally it should be in DomainService, so TODO:
        if(categoryId == Guid.Empty)
            throw new ArgumentException("CategoryId cannot be empty", nameof(categoryId));
        CategoryId = categoryId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AssignToInboxCategory() // TODO: normally it should be in DomainService, so TODO: (also the implementation is weird. Should be normal in database inbox category, not just null)
    {
        CategoryId = null;
        UpdatedAt = DateTime.UtcNow;
    }



    private TaskEntity() { } // this is not for EFC as usual, but for LoadFromPersistence method, which is for EFC. 
                             // I want to make it private, so nobody else can use it, only infrastructure layer.
                             // I understand that this constructor is needed for the LoadFromPersistence method to work properly.
                             //Oh! It generates two warnings. So, TOASK. 

    public static TaskEntity LoadFromPersistence(TaskEntityState state)
    {
        var task = new TaskEntity
        {
            Id = state.id,
            UserId = state.userId,
            Title = state.title,
            Description = state.description,
            Color = state.color,

            IsCompleted = state.isCompleted,
            IsFailed = state.isFailed,
            PriorityId = state.priorityId,
            PriorityLevel = state.priorityLevel, // TEMP FIELD
            StatusId = state.statusId,
            CategoryId = state.categoryId, // Null means Inbox

            CreatedAt = state.createdAt,
            UpdatedAt = state.updatedAt,
            Deadline = state.deadline,
            CompletedAt = state.completedAt,
            FailedAt = state.failedAt,

            _labelIds = state.labels?.ToList() ?? new List<Guid>(),
            PositionOrder = state.order
        };

        if (state.reminders != null)
            task._reminders.AddRange(state.reminders);

        if (state.attachments != null)
            task._attachments.AddRange(state.attachments);

        if (state.dependencies != null)
            task._dependencies.AddRange(state.dependencies);

        if (state.customRelations != null)
            task._customRelations.AddRange(state.customRelations);

        return task;
    }

    // Functionality for Updating the Entity. It is not good to do like that, but
    // We have not much time, so I do it like that for now
    public void Update(TaskEntityUpdateParams updateParams)
    {
        if (updateParams.Title != null)
            Rename(updateParams.Title);

        if (updateParams.Description != null)
            UpdateDescription(updateParams.Description);

        if (updateParams.Color != null)
            ChangeColor(updateParams.Color);

        if (updateParams.PriorityId.HasValue)
            ChangePriority(updateParams.PriorityId.Value);

        if (updateParams.PriorityLevel.HasValue)
            PriorityLevel = updateParams.PriorityLevel.Value; // TEMP FIELD

        if (updateParams.StatusId.HasValue)
            ChangeStatus(updateParams.StatusId.Value);

        if (updateParams.CategoryId.HasValue)
            ChangeCategory(updateParams.CategoryId.Value);

        if (updateParams.Deadline.HasValue)
            ChangeDeadline(updateParams.Deadline);

        if (updateParams.Order.HasValue)
            Reorder(updateParams.Order.Value);

        if (updateParams.Labels != null)
            _labelIds = updateParams.Labels.ToList();

        // Completion state
        if (updateParams.IsCompleted.HasValue)
        {
            if (updateParams.IsCompleted.Value && !IsCompleted)
                MarkCompleted();
            else if (!updateParams.IsCompleted.Value && IsCompleted)
            {
                IsCompleted = false;
                CompletedAt = null;
                UpdatedAt = DateTime.UtcNow;
            }
        }

        // Failure state
        if (updateParams.IsFailed.HasValue)
        {
            if (updateParams.IsFailed.Value && !IsFailed)
                MarkFailed();
            else if (!updateParams.IsFailed.Value && IsFailed)
            {
                IsFailed = false;
                FailedAt = null;
                UpdatedAt = DateTime.UtcNow;
            }
        }

        // Optional CompletedAt override
        if (updateParams.CompletedAt.HasValue)
            CompletedAt = updateParams.CompletedAt;

        // Optional FailedAt override
        if (updateParams.FailedAt.HasValue)
            FailedAt = updateParams.FailedAt;

        UpdatedAt = DateTime.UtcNow; // finally update UpdatedAt
    }



}

public record TaskEntityCreateParams(
        Guid userId,
        string title,
        string? description,
        string color,
        Guid? priorityId,
        int priorityLevel,  // TEMP FIELD
        Guid? statusId,
        Guid? categoryId, // Null = Inbox
        DateTime? deadline,
        IEnumerable<Guid>? labels = null,
        int order = 0); // creation parameters. 
        // I use this record to pass parameters to the constructor of TaskEntity to not mess up with their order and to make it more readable

public record TaskEntityState(
        Guid id,
        Guid userId,
        string title,
        string? description,
        string color,
        bool isCompleted,
        bool isFailed,
        Guid? priorityId,
        int priorityLevel,  // TEMP FIELD
        Guid? statusId,
        Guid? categoryId,
        DateTime? createdAt,
        DateTime? updatedAt,
        DateTime? deadline,
        DateTime? completedAt,
        DateTime? failedAt,
        IEnumerable<Guid>? labels = null,
        IEnumerable<TaskReminder>? reminders = null,
        IEnumerable<TaskAttachment>? attachments = null,
        IEnumerable<TaskDependencyRelation>? dependencies = null,
        IEnumerable<TaskCustomRelation>? customRelations = null,
        int order = 0);





// Functionality for Updating the Entity. It is not good to do like that, but
// We have not much time, so I do it like that for now
public record TaskEntityUpdateParams(
    string? Title,
    string? Description,
    string? Color,
    Guid? PriorityId,
    int? PriorityLevel,  // TEMP FIELD
    Guid? StatusId,
    Guid? CategoryId,
    DateTime? Deadline,
    IEnumerable<Guid>? Labels = null,
    int? Order = 0,
    bool? IsCompleted = false,
    bool? IsFailed = false,
    DateTime? CompletedAt = null,
    DateTime? FailedAt = null
);

