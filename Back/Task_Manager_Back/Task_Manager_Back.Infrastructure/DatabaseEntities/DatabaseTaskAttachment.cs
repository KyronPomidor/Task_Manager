using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskAttachment
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid TaskId { get; set; }

    public string FilePath { get; set; } = null!;
    public string FileType { get; set; } = null!;
    public string FileName { get; set; } = null!;
    public long? Size { get; set; }

    // Навигационное свойство для связи с задачей
    public DatabaseTaskEntity Task { get; set; } = null!;
}
