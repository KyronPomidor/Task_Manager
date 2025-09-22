using System;

namespace Task_Manager_Back.Api.ApiRequests.TaskApiRequests;

public record CreateTaskApiRequest(
    string Title,
    Guid CategoryId,
    string? Description = null,
    string? Color = "#FFFFFF", // TODO: do it optional, default null
    Guid? PriorityId = null,
    Guid? StatusId = null,
    DateTime? Deadline = null,
    List<Guid>? LabelIds = null,
    int OrderPosition = 0);
