using MediatR;
using Task_Manager_Back.Domain.Entities.Enums;

namespace Task_Manager_Back.Application.Requests.TaskRequests;
public record UpdateTaskRequest(
    Guid TaskId,
    Guid UserId,
    string NewTitle,
    string NewDescription,
    Guid NewStatusId,
    Guid NewCategoryId,
    Guid NewParentTaskId,
    DateTime NewDeadline,
    TaskPriority NewPriority,
    string NewColor,
    bool IsCompleted,
    int NewPositionOrder,
    int NewPrice
) : IRequest;
