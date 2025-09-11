using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskRequests;

public record PatchTaskRequest(
    Guid TaskId,
    string? Title = null,
    string? Description = null,
    Guid? StatusId = null,
    Guid? PriorityId = null,
    Guid? CategoryId = null,
    DateTime? Deadline = null,
    bool? MarkCompleted = null,
    bool? MarkFailed = null
) : IRequest;
