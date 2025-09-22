using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;
public class UpdateTaskHandler : IRequestHandler<UpdateTaskRequest>
{
    private readonly UpdateTaskUseCase _updateTaskUseCase;

    public UpdateTaskHandler(UpdateTaskUseCase updateTaskUseCase)
    {
        _updateTaskUseCase = updateTaskUseCase;
    }

    public async Task Handle(UpdateTaskRequest request, CancellationToken cancellationToken)
    {
        await _updateTaskUseCase.ExecuteAsync(request);
    }
}