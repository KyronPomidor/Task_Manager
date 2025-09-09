namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record GetTaskByIdRequest(
    Guid TaskId
);