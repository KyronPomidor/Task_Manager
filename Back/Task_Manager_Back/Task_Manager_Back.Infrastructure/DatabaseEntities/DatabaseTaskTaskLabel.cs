using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskTaskLabel
{
    public Guid TaskId { get; set; }
    public DatabaseTaskEntity Task { get; set; } = null!;
    
    public Guid LabelId { get; set; }
    public DatabaseTaskLabel Label { get; set; } = null!;
}
