using System;

namespace Task_Manager_Back.Api.ApiRequests.TaskApiRequests;

public record AssignTaskToCategoryApiRequest(
    Guid TaskId,
    Guid CategoryId
);
