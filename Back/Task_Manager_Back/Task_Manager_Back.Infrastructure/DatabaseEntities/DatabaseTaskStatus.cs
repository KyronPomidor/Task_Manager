using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskStatus
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Tittle { get; set; } = null!;
    public string? Description { get; set; }

    //Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public ICollection<DatabaseTaskEntity> Tasks { get; set; } = new List<DatabaseTaskEntity>();
}
