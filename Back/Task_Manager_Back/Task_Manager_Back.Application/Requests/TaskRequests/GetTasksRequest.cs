namespace Task_Manager_Back.Application.Requests.TaskRequests;
using MediatR;
using Task_Manager_Back.Domain.Entities.TaskRelated;

public record GetTasksRequest(
    
) : IRequest<IReadOnlyList<TaskEntity>>;
