using System;
using MediatR;

namespace Task_Manager_Back.Application.Queries;

public record GetTasksByUserIdQuery(Guid UserId) : IRequest<List<TaskDto>>;
public record TaskDto( 
    Guid Id,
    Guid UserId,
    string Title,
    string? Description,
    string Color,
    Guid? PriorityId,
    int PriorityLevel,
    Guid? StatusId,
    Guid CategoryId,
    DateTime? CreatedAt,
    DateTime? UpdatedAt,
    DateTime? Deadline,
    DateTime? CompletedAt,
    DateTime? FailedAt,
    bool IsCompleted,
    bool IsFailed,
    IReadOnlyList<Guid>? LabelIds,
    int OrderPosition,
    IReadOnlyList<TaskReminderDto>? Reminders,
    IReadOnlyList<TaskAttachmentDto>? Attachments,
    IReadOnlyList<TaskDependencyRelationDto>? Dependencies,
    IReadOnlyList<TaskCustomRelationDto>? CustomRelations
);

public record TaskReminderDto(
    Guid Id,
    DateTime ReminderAt,
    string? Message,
    bool IsSent
);

public record TaskAttachmentDto(
    Guid Id,
    Guid UserId,
    Guid TaskId,
    string FilePath,
    string FileType,
    string FileName,
    long? Size
);

public record TaskDependencyRelationDto(
    Guid FromTaskId,
    Guid ToTaskId
);

public record TaskCustomRelationDto(
    Guid FromTaskId,
    Guid ToTaskId,
    Guid RelationTypeId
);
