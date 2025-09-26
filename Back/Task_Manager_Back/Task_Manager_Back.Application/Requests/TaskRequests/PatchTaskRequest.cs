using MediatR;
using Task_Manager_Back.Domain.Entities.Enums;

namespace Task_Manager_Back.Application.Requests.TaskRequests;

public record PatchTaskRequest(
    Guid TaskId,
    string? Title = null,
    string? Description = null,
    Guid? StatusId = null,
    TaskPriority? Priority = null,
    Guid? CategoryId = null,
    Guid? ParentTaskId = null,
    DateTime? Deadline = null,
    string? Color = null,
    int? PositionOrder = null,
    int? Price = null,
    bool? MarkCompleted = null,
    bool? MarkFailed = null
) : IRequest;
