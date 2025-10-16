using System;
using MediatR;
using Task_Manager_Back.Application.Commands.Tasks;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.CommandHandlers.Tasks;

public class AssignTaskToCategoryCommandHandler : IRequestHandler<AssignTaskToCategoryCommand>
{
    private readonly TaskAssignToCategoryUseCase _taskAssignToCategoryUseCase;
    public AssignTaskToCategoryCommandHandler(TaskAssignToCategoryUseCase taskAssignToCategoryUseCase)
    {
        _taskAssignToCategoryUseCase = taskAssignToCategoryUseCase;
    }
    public async Task Handle(AssignTaskToCategoryCommand request, CancellationToken cancellationToken)
    {
        await _taskAssignToCategoryUseCase.ExecuteAsync(request.TaskId, request.CategoryId);
    }
}
