using MediatR;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;

public class AddTaskReminderHandler : IRequestHandler<AddTaskReminderRequest>
{
    private readonly AddTaskReminderUseCase _addTaskReminderUseCase;

    public AddTaskReminderHandler(AddTaskReminderUseCase addTaskReminderUseCase)
    {
        _addTaskReminderUseCase=addTaskReminderUseCase;
    }

    public async Task Handle(AddTaskReminderRequest request, CancellationToken cancellationToken)
    {
        await _addTaskReminderUseCase.ExecuteAsync(request);
    }
}
