using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
/// <summary>Updates the description of a task category.</summary>
public record UpdateTaskUserCategoryDescriptionRequest(
    Guid CategoryId,
    string? NewDescription
) : IRequest;