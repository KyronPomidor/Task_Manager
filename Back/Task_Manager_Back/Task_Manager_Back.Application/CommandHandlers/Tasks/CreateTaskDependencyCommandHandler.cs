using System;
using MediatR;
using Task_Manager_Back.Application.Commands.Tasks;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.CommandHandlers.Tasks;

public class CreateTaskDependencyCommandHandler : IRequestHandler<CreateTaskDependencyCommand>
{
    private readonly AddTaskDependencyUseCase _addTaskDependencyUseCase;
    public CreateTaskDependencyCommandHandler(AddTaskDependencyUseCase addTaskDependencyUseCase)
    {
        _addTaskDependencyUseCase = addTaskDependencyUseCase;
    }
    public async Task Handle(CreateTaskDependencyCommand command, CancellationToken cancellationToken)
    {
        await _addTaskDependencyUseCase.ExecuteAsync(command.TaskId, command.DependsOnTaskId);
    }
}
