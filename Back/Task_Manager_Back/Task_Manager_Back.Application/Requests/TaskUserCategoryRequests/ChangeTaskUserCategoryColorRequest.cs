using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskCategoryRequests;
/// <summary>Changes the display color of a task category.</summary>
public record ChangeTaskUserCategoryColorRequest(
    Guid CategoryId,
    string NewColor
) : IRequest;