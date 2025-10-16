using System;

namespace Task_Manager_Back.Api.ApiRequests.TaskApiRequests;

public record CreateTaskDependencyApiRequest(
    Guid TaskId,
    Guid DependsOnTaskId);
    //Guid UserId //later
