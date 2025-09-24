using System;
using MediatR;

namespace Task_Manager_Back.Application.Commands.Tasks;

public record CreateTaskCommand
(
    Guid UserId,
    string Title,
    string? Description,
    string Color,  //TODO: do it optional
    Guid CategoryId,
    Guid? StatusId = null,
    Guid? PriorityId = null,
    int PriorityLevel = 0,
    DateTime? Deadline = null,
    List<Guid>? LabelIds = null,
    int OrderPosition = 0

) : IRequest<Guid>;
