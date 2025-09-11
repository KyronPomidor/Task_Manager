using MediatR;
namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record DeleteTaskByIdRequest(
    Guid TaskId
) : IRequest;
