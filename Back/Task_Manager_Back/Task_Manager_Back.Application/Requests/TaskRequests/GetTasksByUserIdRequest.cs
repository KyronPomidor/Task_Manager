namespace Task_Manager_Back.Application.Requests.TaskRequests;
using MediatR;
using Task_Manager_Back.Domain.Entities.TaskRelated;

public record GetTasksByUserIdRequest(
    Guid UserId
) : IRequest<IReadOnlyList<TaskEntity>>;
