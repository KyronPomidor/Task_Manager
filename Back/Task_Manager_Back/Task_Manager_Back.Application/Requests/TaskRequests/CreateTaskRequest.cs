using MediatR;
using Task_Manager_Back.Domain.Entities.Enums;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record CreateTaskRequest(
    Guid UserId,
    string Title,
    string? Description,
    string Color,
    Guid? StatusId,
    Guid CategoryId,
    TaskLocation? Location,
    TaskPriority? Priority,
    DateTime? Deadline,
    bool? IsCompleted,
    int PositionOrder,
    int? Price,
    List<Guid>? DependsOnTasksIds
) : IRequest<Guid>;
