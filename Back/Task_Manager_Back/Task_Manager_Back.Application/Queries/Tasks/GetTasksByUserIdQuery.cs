using System;
using MediatR;

namespace Task_Manager_Back.Application.Queries;

public record GetTasksByUserIdQuery(Guid UserId) : IRequest<List<TaskDto>>;


public record TaskDto( 
    Guid Id,
    Guid UserId,
    string Title,
    string? Description,
    string? Color,
    Guid? PriorityId,
    Guid? StatusId,
    Guid CategoryId,
    DateTime? Deadline,
    IReadOnlyList<Guid>? LabelIds,
    int OrderPosition,
    IReadOnlyList<TaskCustomRelationDto>? CustomRelations
);


public record TaskCustomRelationDto(
    Guid FromTaskId,
    Guid ToTaskId,
    Guid RelationTypeId
);