using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record CreateTaskRequest(
    Guid UserId,
    string Title,
    string? Description,
    Guid StatusId,
    Guid PriorityId,
    Guid CategoryId,
    DateTime? Deadline
) : IRequest;
