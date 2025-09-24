using System;
using MediatR;
using Task_Manager_Back.Application.Commands.Tasks;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.CommandHandlers.Tasks;

public class DeleteTaskCommandHandler : IRequestHandler<DeleteTaskCommand>
{
    private readonly DeleteTaskUseCase _deleteTaskUseCase;
    public DeleteTaskCommandHandler(DeleteTaskUseCase deleteTaskUseCase)
    {
        _deleteTaskUseCase = deleteTaskUseCase;
    }
    public async Task Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        await _deleteTaskUseCase.ExecuteAsync(request.TaskId);
    }
}
