using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskCategoryRequests;
/// <summary>Renames an existing task category.</summary>
public record RenameTaskUserCategoryRequest(
    Guid CategoryId,
    string NewTitle
) : IRequest;