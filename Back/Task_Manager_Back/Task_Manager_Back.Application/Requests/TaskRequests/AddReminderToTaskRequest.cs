
namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record AddReminderToTaskRequest(
    Guid TaskId,
    Guid UserId,
    DateTime Time,
    string Message
);