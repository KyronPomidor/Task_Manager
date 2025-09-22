using MediatR;

namespace Task_Manager_Back.Application.Requests.TaskRequests;

public record RemoveTaskRelationRequest(
    Guid FromTaskId,
    Guid ToTaskId
) : IRequest;
