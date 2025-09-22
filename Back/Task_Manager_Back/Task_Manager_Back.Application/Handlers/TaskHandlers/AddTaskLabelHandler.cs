using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;
public class AddTaskLabelHandler : IRequestHandler<AddTaskLabelRequest>
{
    private readonly AddTaskLabelUseCase _addTaskLabelUseCase;

    public AddTaskLabelHandler(AddTaskLabelUseCase addTaskLabelUseCase)
    {
        _addTaskLabelUseCase=addTaskLabelUseCase;
    }

    public async Task Handle(AddTaskLabelRequest request, CancellationToken cancellationToken)
    {
        await _addTaskLabelUseCase.ExecuteAsync(request);
    }
}