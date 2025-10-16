using System;

namespace Task_Manager_Back.Api.ApiRequests.TaskApiRequests;

public record UpdateTaskApiRequest(
    Guid TaskId,                          // required to know what to update
    string? Title = null,
    string? Description = null,
    string? Color = null,
    Guid? PriorityId = null,
    int? PriorityLevel = null,            // TEMP FIELD
    Guid? StatusId = null,
    Guid? CategoryId = null,
    DateTime? Deadline = null,
    List<Guid>? LabelIds = null,
    int? OrderPosition = null,
    bool? IsCompleted = null,
    bool? IsFailed = null,
    DateTime? CompletedAt = null,
    DateTime? FailedAt = null
);
