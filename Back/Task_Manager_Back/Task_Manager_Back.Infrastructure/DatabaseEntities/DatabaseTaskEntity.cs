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
    public Guid CategoryId { get; set; }

    // Т.к. EF Core не умеет хранить List<Guid> напрямую — сделаем отдельную таблицу TaskLabels
    public ICollection<DatabaseTaskTaskLabel> Labels { get; set; } = new List<DatabaseTaskTaskLabel>();

    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? Deadline { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? FailedAt { get; set; }

    public int PositionOrder { get; set; }

    // Навигационные свойства для зависимостей и других сущностей
    public ICollection<DatabaseTaskReminder> Reminders { get; set; } = new List<DatabaseTaskReminder>();
    public ICollection<DatabaseTaskAttachment> Attachments { get; set; } = new List<DatabaseTaskAttachment>();
    public ICollection<DatabaseTaskDependencyRelation> Dependencies { get; set; } = new List<DatabaseTaskDependencyRelation>();
    public ICollection<DatabaseTaskCustomRelation> CustomRelations { get; set; } = new List<DatabaseTaskCustomRelation>();
    
}
