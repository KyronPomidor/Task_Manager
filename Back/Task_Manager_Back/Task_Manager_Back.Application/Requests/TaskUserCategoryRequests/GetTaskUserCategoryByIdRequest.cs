using MediatR;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;

public record GetTaskUserCategoryByIdRequest(Guid CategoryId) : IRequest<TaskUserCategory?>;
