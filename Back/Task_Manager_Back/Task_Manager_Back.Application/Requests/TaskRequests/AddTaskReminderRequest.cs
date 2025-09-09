
namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record AddTaskReminderRequest(
    Guid TaskId,
    Guid UserId,
    DateTime Time,
    string Message
);
