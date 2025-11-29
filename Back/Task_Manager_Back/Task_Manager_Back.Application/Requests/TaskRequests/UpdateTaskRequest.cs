using MediatR;
using Task_Manager_Back.Domain.Entities.Enums;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record UpdateTaskRequest(
    Guid TaskId,
    Guid UserId,
    string NewTitle,
    string NewDescription,
    Guid NewStatusId,
    Guid NewCategoryId,
    TaskLocation NewLocation,
    DateTime NewDeadline,
    TaskPriority NewPriority,
    string NewColor,
    bool IsCompleted,
    int Price,
    int NewPositionOrder,
    int NewPrice,
    List<Guid> NewDependsOnTasksIds
) : IRequest;
