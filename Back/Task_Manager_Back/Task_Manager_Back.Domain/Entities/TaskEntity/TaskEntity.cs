using Task_Manager_Back.Domain.Aggregates.ShopAggregate;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Domain.TaskEntity;

public class TaskEntity
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; } // Assuming tasks are associated with users
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public bool IsCompleted { get; private set; }
    public bool IsFailed { get; private set; }
    public List<Guid>? TaskLabelsId { get; private set; }
    public Guid PriorityId { get; private set; }
    public Guid StatusId { get; private set; }
    public Guid CategoryId { get; private set; }

    public DateTime? CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; } // idk if I need this
    public DateTime? Deadline { get; private set; } // nullable, as not all tasks have deadlines
    public DateTime? CompletedAt { get; private set; } // nullable, as not all tasks are completed
    public DateTime? FailedAt { get; private set; }

    private readonly List<TaskDependencyRelation> _dependencies = new List<TaskDependencyRelation>();
    private readonly List<TaskCustomRelation> _customRelations = new List<TaskCustomRelation>();

    public IReadOnlyCollection<TaskDependencyRelation> Dependencies => _dependencies.AsReadOnly();
    public IReadOnlyCollection<TaskCustomRelation> CustomRelations => _customRelations.AsReadOnly();

    // For UI ordering among siblings
    public int Order { get; private set; }

    public TaskEntity(
        Guid userId,
        string title,
        string? description,
        Guid priorityId,
        Guid statusId,
        Guid categoryId,
        DateTime? deadline,
        IEnumerable<Guid>? taskLabelsId = null,
        int order = 0)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = !string.IsNullOrWhiteSpace(title)
            ? title
            : throw new ArgumentNullException(nameof(title));
        Description = description;

        PriorityId = priorityId;
        StatusId = statusId;
        CategoryId = categoryId;

        Deadline = deadline;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = null;

        CompletedAt = null;
        FailedAt = null;
        IsCompleted = false;
        IsFailed = false;

        TaskLabelsId = taskLabelsId?.ToList() ?? new List<Guid>();
        Order = order;
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

    public void ChangeStatus(Guid newStatusId)
    {
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
        Order = newOrder;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddLabel(Guid labelId)
    {
        if (TaskLabelsId == null) TaskLabelsId = new List<Guid>();
        if (!TaskLabelsId.Contains(labelId))
        {
            TaskLabelsId.Add(labelId);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public void RemoveLabel(Guid labelId)
    {
        if (TaskLabelsId != null && TaskLabelsId.Contains(labelId))
        {
            TaskLabelsId.Remove(labelId);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public bool HasLabel(Guid labelId)
    {
        return TaskLabelsId != null && TaskLabelsId.Contains(labelId);
    }

    public void ClearLabels()
    {
        if (TaskLabelsId != null && TaskLabelsId.Any())
        {
            TaskLabelsId.Clear();
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
    }

}

