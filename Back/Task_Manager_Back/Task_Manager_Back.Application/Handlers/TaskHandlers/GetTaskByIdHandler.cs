using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;
public class GetTaskByIdHandler : IRequestHandler<GetTaskByIdRequest, TaskEntity>
{
    private readonly GetTaskByIdUseCase _getTaskByIdUseCase;

    public GetTaskByIdHandler(GetTaskByIdUseCase getTaskByIdUseCase)
    {
        _getTaskByIdUseCase = getTaskByIdUseCase;
    }

    public async Task<TaskEntity> Handle(GetTaskByIdRequest request, CancellationToken cancellationToken)
    {
        var task = await _getTaskByIdUseCase.ExecuteAsync(request);
        return task;
    }
}