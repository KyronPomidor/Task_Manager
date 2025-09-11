

using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;

public class DeleteTaskByIdHandler : IRequestHandler<DeleteTaskByIdRequest>
{
    private readonly DeleteTaskByIdUseCase _deleteTaskByIdUseCase;

    public DeleteTaskByIdHandler(DeleteTaskByIdUseCase deleteTaskByIdUseCase)
    {
        _deleteTaskByIdUseCase=deleteTaskByIdUseCase;
    }

    public async Task Handle(DeleteTaskByIdRequest request, CancellationToken cancellationToken)
    {
        await _deleteTaskByIdUseCase.ExecuteAsync(request);
    }
}   
