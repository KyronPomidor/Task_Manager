using System;

namespace Task_Manager_Back.Api.ApiRequests.TaskApiRequests;

public record CreateTaskApiRequest(
    Guid UserId,
    string Title,
    Guid? CategoryId, // for now Null means Inbox Category. Change later to non-nullable with default value to inbox Id on specific User. 
    string? Description = null,
    string? Color = "#FFFFFF", // TODO: do it optional, default null
    Guid? PriorityId = null,
    int PriorityLevel = 0, // TEMPORARY
    Guid? StatusId = null,
    DateTime? Deadline = null,
    List<Guid>? LabelIds = null,
    int OrderPosition = 0);
