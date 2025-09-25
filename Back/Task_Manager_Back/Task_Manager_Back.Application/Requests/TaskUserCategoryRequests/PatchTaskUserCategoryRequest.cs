using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;

/// <summary>Partially updates an existing user-defined task category.</summary>
public record PatchTaskUserCategoryRequest(
    Guid CategoryId,
    string? Title,
    string? Description,
    Guid? ParentCategoryId,
    int? PositionOrder,
    string? Color
) : IRequest;
