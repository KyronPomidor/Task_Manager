using MediatR;
using Task_Manager_Back.Domain.Entities.Categories;

namespace Task_Manager_Back.Application.Requests.CategoryRequests;

public record GetTaskUserCategoryByIdRequest(Guid CategoryId) : IRequest<TaskUserCategory?>;
