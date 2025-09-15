using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskCategoryRequests;
/// <summary>Deletes a task category by ID (if allowed).</summary>
public record DeleteTaskUserCategoryRequest(
    Guid CategoryId
) : IRequest;