using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskCategoryRequests;
/// <summary>Creates a new user-defined task category.</summary>
public record CreateTaskUserCategoryRequest(
    Guid UserId,
    string Title,
    string? Description,
    Guid? ParentCategoryId,
    string Color
) : IRequest;