
using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record AddTaskRelationRequest(
    Guid FromTaskId,
    Guid ToTaskId
) : IRequest;
