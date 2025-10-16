using System;

namespace Task_Manager_Back.Api.ApiRequests.TaskApiRequests;

public record DeleteTaskApiRequest
(
    //Guid UserId, //later
    Guid TaskId);
