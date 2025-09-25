using MediatR;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.Requests;

public record GetOrCreateInboxForUserRequest(Guid UserId) : IRequest<TaskCategory>;
