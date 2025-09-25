using System;

namespace Task_Manager_Back.Api.ApiRequests.TaskCategoryApiRequests;

public record CreateTaskCategoryApiRequest(
    Guid UserId,
    string Title,
    string? Description,
    Guid? ParentCategoryId
);
