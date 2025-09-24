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
            Deadline: task.Deadline,
            LabelIds: task.LabelIds?.ToList(),
            OrderPosition: task.PositionOrder,
            CustomRelations: task.CustomRelations.Select(c => new TaskCustomRelationDto(
                FromTaskId: c.FromTaskId,
                ToTaskId: c.ToTaskId,
                RelationTypeId: c.RelationTypeId
            )).ToList()
        )).ToList(); // <-- make it a List because your query expects List<TaskDto>

        return taskDtos;
    }
}


