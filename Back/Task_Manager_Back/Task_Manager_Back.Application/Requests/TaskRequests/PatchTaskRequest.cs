using MediatR;
using Task_Manager_Back.Domain.Entities.Enums;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.Requests.TaskRequests;

public record PatchTaskRequest(
    Guid TaskId,
    string? Title,
    string? Description,
    Guid? StatusId,
    TaskPriority? Priority,
    Guid? CategoryId,
    TaskLocation? Location,
    DateTime? Deadline,
    string? Color,
    int? PositionOrder,
    int? Price,
    bool? MarkCompleted,
    bool? MarkFailed,
    List<Guid>? DependsOnTasksIds
) : IRequest;
