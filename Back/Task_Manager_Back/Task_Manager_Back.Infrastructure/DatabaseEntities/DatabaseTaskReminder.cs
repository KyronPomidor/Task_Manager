using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskReminder
{
    public Guid Id { get; set; }
    public Guid TaskId { get; set; }
    public DateTime ReminderAt { get; set; }
    public string? Message { get; set; }
    public bool IsSent { get; set; }

    // Navigation properties
    public DatabaseTaskEntity Task { get; set; } = null!;
}
