using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskLabel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public string Color { get; set; } = null!;

    // Навигационное свойство для связи с задачами (многие ко многим)
    public ICollection<DatabaseTaskEntity> Tasks { get; set; } = new List<DatabaseTaskEntity>();

}
