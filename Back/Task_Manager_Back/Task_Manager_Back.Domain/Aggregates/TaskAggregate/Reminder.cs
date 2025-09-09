namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;
public class Reminder
{
    public Guid Id { get; private set; }
    public Guid TaskId { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime Time { get; private set; }
    public string Message { get; private set; }

    public Reminder(Guid taskId, Guid userId, DateTime time, string message)
    {
        Id = Guid.NewGuid();
        TaskId = taskId == Guid.Empty ? throw new ArgumentException("TaskId required", nameof(taskId)) : taskId;
        UserId = userId == Guid.Empty ? throw new ArgumentException("UserId required", nameof(userId)) : userId;
        Time = time < DateTime.UtcNow ? throw new ArgumentException("Reminder time cannot be in the past", nameof(time)) : time;
        Message = string.IsNullOrEmpty(message) ? throw new ArgumentNullException(nameof(message)) : message;
    }
    private Reminder() { }
    public static Reminder LoadFromPersistence(Guid id, Guid taskId, Guid userId, DateTime time, string message)
    {
        return new Reminder
        {
            Id = id,
            TaskId = taskId,
            UserId = userId,
            Time = time,
            Message = message
        };
    }
}