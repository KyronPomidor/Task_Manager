using System;

namespace Task_Manager_Back.Api.ApiRequests.TaskApiRequests;

public record DeleteTaskDependencyApiRequest
(
    Guid TaskId,
    Guid DependsOnTaskId);
    //Guid UserId //later