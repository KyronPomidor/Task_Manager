using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskEntity
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public string Color { get; set; } = null!;

    public bool IsCompleted { get; set; }
    public bool IsFailed { get; set; }
    public Guid? PriorityId { get; set; }
    public Guid? StatusId { get; set; }
    public Guid DatabaseCustomCategoryId { get; set; }


    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? Deadline { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? FailedAt { get; set; }

    public int PositionOrder { get; set; }

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public DatabaseTaskPriority? Priority { get; set; }
    public DatabaseTaskStatus? Status { get; set; }
    public DatabaseCustomCategory DatabaseCustomCategory { get; set; } = null!;
    public ICollection<DatabaseTaskLabel> Labels { get; set; } = new List<DatabaseTaskLabel>();
    public ICollection<DatabaseTaskReminder> Reminders { get; set; } = new List<DatabaseTaskReminder>();
    public ICollection<DatabaseTaskAttachment> Attachments { get; set; } = new List<DatabaseTaskAttachment>();

    // In Dependencies, a task can be both the source and the target
    public ICollection<DatabaseTaskDependencyRelation> DependenciesFrom { get; set; } = new List<DatabaseTaskDependencyRelation>();
    public ICollection<DatabaseTaskDependencyRelation> DependenciesTo { get; set; } = new List<DatabaseTaskDependencyRelation>();

    // In CustomRelations, a task can be both the source and the target
    public ICollection<DatabaseTaskCustomRelation> CustomRelationsFrom { get; set; } = new List<DatabaseTaskCustomRelation>();
    public ICollection<DatabaseTaskCustomRelation> CustomRelationsTo { get; set; } = new List<DatabaseTaskCustomRelation>();
    
}
