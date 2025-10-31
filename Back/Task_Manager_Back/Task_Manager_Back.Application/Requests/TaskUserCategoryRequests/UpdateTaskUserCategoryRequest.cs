using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;

/// <summary>Replaces an existing user-defined task category.</summary>
public record UpdateTaskUserCategoryRequest(
    Guid CategoryId,
    string Title,
    string? Description,
    Guid? ParentCategoryId,
    int PositionOrder,
    string Color
) : IRequest;
