using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskReminder
{
    public Guid Id { get; private set; }
    public Guid TaskId { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime Time { get; private set; }
    public string Message { get; private set; }

    public TaskReminder(TaskReminderCreateParams @params)
    {
        Id = Guid.NewGuid();
        TaskId = ValidationHelper.ValidateGuid(@params.TaskId, nameof(@params));
        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params));
        Time = ValidationHelper.ValidateNotPast(@params.Time, nameof(@params));
        Message = string.IsNullOrWhiteSpace(@params.Message) ? throw new ArgumentNullException(nameof(@params)) : @params.Message;
    }

    private TaskReminder() { }
    public static TaskReminder LoadFromPersistence(TaskReminderState state)
    {
        return new TaskReminder
        {
            Id = state.Id,
            TaskId = state.TaskId,
            UserId = state.UserId,
            Time = state.Time,
            Message = state.Message
        };
    }
}

public record TaskReminderCreateParams(Guid TaskId, Guid UserId, DateTime Time, string Message);
public record TaskReminderState(Guid Id, Guid TaskId, Guid UserId, DateTime Time, string Message);
