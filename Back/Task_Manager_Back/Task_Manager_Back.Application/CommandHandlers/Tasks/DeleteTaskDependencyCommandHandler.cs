using System;
using MediatR;
using Task_Manager_Back.Application.Commands.Tasks;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.CommandHandlers.Tasks;


public class DeleteTaskDependencyCommandHandler : IRequestHandler<DeleteTaskDependencyCommand>
{
    private readonly DeleteTaskDependencyUseCase _deleteTaskDependencyUseCase;
    public DeleteTaskDependencyCommandHandler(DeleteTaskDependencyUseCase deleteTaskDependencyUseCase)
    {
        _deleteTaskDependencyUseCase = deleteTaskDependencyUseCase;
    }
    public async Task Handle(DeleteTaskDependencyCommand command, CancellationToken cancellationToken)
    {
        await _deleteTaskDependencyUseCase.ExecuteAsync(command.TaskId, command.DependsOnTaskId);
    }
}
