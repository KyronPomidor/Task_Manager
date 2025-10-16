using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskLabel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public string Color { get; set; } = null!;

    // Navigation properties
    public ICollection<DatabaseTaskEntity> Tasks { get; set; } = new List<DatabaseTaskEntity>();
    public ApplicationUser User { get; set; } = null!;
}
