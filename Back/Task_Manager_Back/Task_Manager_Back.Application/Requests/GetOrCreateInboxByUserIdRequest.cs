using MediatR;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.Requests;

public record GetOrCreateInboxByUserIdRequest(Guid UserId) : IRequest<TaskCategory>;
