using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;
public class GetTasksHandler : IRequestHandler<GetTasksRequest, IReadOnlyList<TaskEntity>>
{
    private readonly GetTasksUseCase _getTasksUseCase;

    public GetTasksHandler(GetTasksUseCase getTasksUseCase)
    {
        _getTasksUseCase = getTasksUseCase;
    }

    public async Task<IReadOnlyList<TaskEntity>> Handle(GetTasksRequest request, CancellationToken cancellationToken)
    {
        var tasks = await _getTasksUseCase.ExecuteAsync(request);
        return tasks;
    }
}