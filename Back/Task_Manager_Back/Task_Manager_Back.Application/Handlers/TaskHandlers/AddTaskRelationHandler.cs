using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;
public class AddTaskRelationHandler : IRequestHandler<AddTaskRelationRequest>
{
    private readonly AddTaskRelationUseCase _addTaskRelationUseCase;

    public AddTaskRelationHandler(AddTaskRelationUseCase addTaskRelationUseCase)
    {
        _addTaskRelationUseCase=addTaskRelationUseCase;
    }

    public async Task Handle(AddTaskRelationRequest request, CancellationToken cancellationToken)
    {
        await _addTaskRelationUseCase.ExecuteAsync(request);
    }
}