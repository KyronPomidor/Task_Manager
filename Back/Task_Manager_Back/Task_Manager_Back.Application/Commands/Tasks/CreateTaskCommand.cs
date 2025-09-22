using System;
using MediatR;

namespace Task_Manager_Back.Application.Commands.Tasks;

public record CreateTaskCommand
(
    Guid UserId,
    string Title,
    string? Description,
    string Color,
    Guid? StatusId,
    Guid? PriorityId,
    Guid CategoryId,
    DateTime? Deadline,
    System.Collections.Generic.List<Guid> LabelIds,
    int OrderPosion

) : IRequest<Guid>;
