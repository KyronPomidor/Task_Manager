using System;
using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskReminder
{
    public Guid Id { get; private set; }
    public Guid TaskId { get; private set; }
    public DateTime ReminderAt { get; private set; }
    public string? Message { get; private set; }
    public bool IsSent { get; private set; }

    public TaskReminder(Guid taskId, DateTime reminderAt, string? message = null)
    {
        Id = Guid.NewGuid();
        TaskId = taskId;
        ReminderAt = reminderAt;
        Message = message;
        IsSent = false;
    }

    public static TaskReminder LoadFromPersistence(Guid id, Guid taskId, DateTime reminderAt, string? message, bool isSent)
    {
        // return new TaskReminder // factory method to load from DB, IDK why is underredlined
        // {
        //     Id = id,
        //     TaskId = taskId,
        //     ReminderAt = reminderAt,
        //     Message = message,
        //     IsSent = isSent
        // }; 

        // idk why the above code is underlined, so I rewrote it like this:
        // I understand now, that is because the code above wants the empty constructor, which I did not create

        var reminder = new TaskReminder(taskId, reminderAt, message);
        reminder.Id = id;
        reminder.IsSent = isSent;
        return reminder;
    }

    public void MarkAsSent() => IsSent = true;
}
