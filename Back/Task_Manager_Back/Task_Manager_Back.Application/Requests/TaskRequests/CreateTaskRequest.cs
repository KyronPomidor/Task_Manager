using MediatR;
using Task_Manager_Back.Domain.Entities.Enums;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record CreateTaskRequest(
    Guid UserId,
    string Title,
    string? Description,
    string Color,
    Guid? StatusId,
    TaskPriority? Priority,
    Guid CategoryId,
    DateTime? Deadline
) : IRequest;
