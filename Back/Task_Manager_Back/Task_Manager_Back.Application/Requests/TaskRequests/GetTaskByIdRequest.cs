using MediatR;
using Task_Manager_Back.Domain.Entities.TaskRelated;
namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record GetTaskByIdRequest(
    Guid TaskId
) : IRequest<TaskEntity>;