using MediatR;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
public record GetTaskUserCategoriesRequest(
    Guid UserId
) : IRequest<IReadOnlyList<TaskUserCategory>>;