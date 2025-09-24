using System;
using MediatR;
using Task_Manager_Back.Application.Queries;
using Task_Manager_Back.Application.Queries.Tasks;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.QueryHandlers.Tasks;

public class GetTaskByIdQueryHandler : IRequestHandler<GetTaskByIdQuery, TaskDto>
{
    private readonly GetTaskUseCase _getTaskUseCase;
    public GetTaskByIdQueryHandler(GetTaskUseCase getTaskUseCase)
    {
        _getTaskUseCase = getTaskUseCase;
    }
    public async Task<TaskDto> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        var task = await _getTaskUseCase.ExecuteAsync(request.TaskId);
        var taskDto = new TaskDto(
                        Id: task.Id,
                        UserId: task.UserId,
                        Title: task.Title,
                        Description: task.Description,
                        Color: task.Color,
                        PriorityId: task.PriorityId,
                        PriorityLevel: task.PriorityLevel, // TEMPORARY
                        StatusId: task.StatusId,
                        CategoryId: task.CategoryId,
                        CreatedAt: task.CreatedAt,
                        UpdatedAt: task.UpdatedAt,
                        Deadline: task.Deadline,
                        CompletedAt: task.CompletedAt,
                        FailedAt: task.FailedAt,
                        IsCompleted: task.IsCompleted,
                        IsFailed: task.IsFailed,
                        LabelIds: task.LabelIds?.ToList(),
                        OrderPosition: task.PositionOrder,
                        Reminders: task.Reminders.Select(r => new TaskReminderDto(
                            Id: r.Id,
                            ReminderAt: r.ReminderAt,
                            Message: r.Message,
                            IsSent: r.IsSent
                        )).ToList(),
                        Attachments: task.Attachments.Select(a => new TaskAttachmentDto(
                            Id: a.Id,
                            UserId: a.UserId,
                            TaskId: a.TaskId,
                            FilePath: a.FilePath,
                            FileType: a.FileType,
                            FileName: a.FileName,
                            Size: a.Size
                        )).ToList(),
                        Dependencies: task.Dependencies.Select(d => new TaskDependencyRelationDto(
                            FromTaskId: d.FromTaskId,
                            ToTaskId: d.ToTaskId
                        )).ToList(),
                        CustomRelations: task.CustomRelations.Select(c => new TaskCustomRelationDto(
                            FromTaskId: c.FromTaskId,
                            ToTaskId: c.ToTaskId,
                            RelationTypeId: c.RelationTypeId
                        )).ToList()
                    );
        return taskDto;
    }
}
