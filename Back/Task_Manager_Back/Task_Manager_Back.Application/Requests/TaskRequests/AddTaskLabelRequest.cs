using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record AddTaskLabelRequest(
    Guid TaskId,
    Guid UserId,
    string Title,
    string? Description
) : IRequest;