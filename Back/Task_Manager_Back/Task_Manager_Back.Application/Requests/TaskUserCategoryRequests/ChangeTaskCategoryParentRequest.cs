using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskCategoryRequests;
/// <summary>Changes the parent of a task category (for hierarchy).</summary>
public record ChangeTaskCategoryParentRequest(
    Guid CategoryId,
    Guid? NewParentCategoryId
) : IRequest;