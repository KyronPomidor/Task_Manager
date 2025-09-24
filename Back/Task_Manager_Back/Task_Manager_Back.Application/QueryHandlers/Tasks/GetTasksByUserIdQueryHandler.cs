using System;
using MediatR;
using Task_Manager_Back.Application.Queries;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.QueryHandlers;

public class GetTasksByUserIdQueryHandler : IRequestHandler<GetTasksByUserIdQuery, List<TaskDto>>
{
    private readonly GetTasksByUserIdUseCase _getTasksByUserIdUseCase;
    public GetTasksByUserIdQueryHandler(GetTasksByUserIdUseCase getTasksByUserIdUseCase)
    {
        _getTasksByUserIdUseCase = getTasksByUserIdUseCase;
    }
    public async Task<List<TaskDto>> Handle(GetTasksByUserIdQuery request, CancellationToken cancellationToken)
    {
        var tasks = await _getTasksByUserIdUseCase.ExecuteAsync(request.UserId);

        var taskDtos = tasks.Select(task => new TaskDto(
            Id: task.Id,
            UserId: task.UserId,
            Title: task.Title,
            Description: task.Description,
            Color: task.Color,
            PriorityId: task.PriorityId,
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
        )).ToList();

        return taskDtos;
    }
}


