using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

// Пользовательские связи между задачами
public class DatabaseTaskCustomRelation
{
    // Composite key: FromTaskId + ToTaskId + RelationTypeId (настроим через Fluent API)
    public Guid FromTaskId { get; set; }
    public Guid ToTaskId { get; set; }
    public Guid RelationTypeId { get; set; }

    // Навигационные свойства
    public DatabaseTaskEntity FromTask { get; set; } = null!;
    public DatabaseTaskEntity ToTask { get; set; } = null!;
    public DatabaseRelationType RelationType { get; set; } = null!;
}
