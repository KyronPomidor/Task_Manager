using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskPriority
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public int Level { get; set; }

    // Navigation properties
    public ICollection<DatabaseTaskEntity> Tasks { get; set; } = new List<DatabaseTaskEntity>();
    public ApplicationUser User { get; set; } = null!;
}
