

using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;

public class CreateTaskHandler : IRequestHandler<CreateTaskRequest, Guid>
{
    private readonly CreateTaskUseCase _createTaskUseCase;

    public CreateTaskHandler(CreateTaskUseCase createTaskUseCase)
    {
        _createTaskUseCase=createTaskUseCase;
    }

    public async Task<Guid> Handle(CreateTaskRequest request, CancellationToken cancellationToken)
    {
        Guid taskId = await _createTaskUseCase.ExecuteAsync(request);
        return taskId;
    }
}
