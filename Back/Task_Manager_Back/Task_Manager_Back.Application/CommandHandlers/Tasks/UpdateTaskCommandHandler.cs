using System;
using MediatR;
using Task_Manager_Back.Application.Commands.Tasks;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.CommandHandlers.Tasks;

public class UpdateTaskCommandHandler : IRequestHandler<UpdateTaskCommand>
{
    private readonly UpdateTaskUseCase _updateTaskUseCase;
    public UpdateTaskCommandHandler(UpdateTaskUseCase updateTaskUseCase)
    {
        _updateTaskUseCase = updateTaskUseCase;
    }
    public async Task Handle(UpdateTaskCommand command, CancellationToken cancellationToken)
    {
        UpdateTaskRequest request = new UpdateTaskRequest(
            TaskId: command.TaskId,
            Title: command.Title,
            Description: command.Description,
            Color: command.Color,
            PriorityId: command.PriorityId,
            PriorityLevel: command.PriorityLevel,
            StatusId: command.StatusId,
            CategoryId: command.CategoryId,
            Deadline: command.Deadline,
            LabelIds: command.LabelIds,
            OrderPosition: command.OrderPosition,
            IsCompleted: command.IsCompleted,
            IsFailed: command.IsFailed,
            CompletedAt: command.CompletedAt,
            FailedAt: command.FailedAt
        );
        await _updateTaskUseCase.ExecuteAsync(request);
        return; // May be changed to return updated TaskDto/TaskId/etc in the future
    }
}