using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

// Зависимость между задачами (cannot complete FromTask, пока не выполнена ToTask)
public class DatabaseTaskDependencyRelation
{
    // Composite key: FromTaskId + ToTaskId (будет настроено через Fluent API)
    public Guid FromTaskId { get; set; }
    public Guid ToTaskId { get; set; }

    // Навигационные свойства
    public DatabaseTaskEntity FromTask { get; set; } = null!;
    public DatabaseTaskEntity ToTask { get; set; } = null!;
}
