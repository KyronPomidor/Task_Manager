using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;
public class RemoveTaskRelationHandler : IRequestHandler<RemoveTaskRelationRequest>
{
    private readonly RemoveTaskRelationUseCase _removeTaskRelationUseCase;

    public RemoveTaskRelationHandler(RemoveTaskRelationUseCase removeTaskRelationUseCase)
    {
        _removeTaskRelationUseCase = removeTaskRelationUseCase;
        
    }
    
    public async Task Handle(RemoveTaskRelationRequest request, CancellationToken cancellationToken)
    {
        await _removeTaskRelationUseCase.ExecuteAsync(request);
    }
}