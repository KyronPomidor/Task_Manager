using MediatR;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.Handlers.TaskHandlers;
public class GetTaskByIdHandler : IRequestHandler<GetTaskByIdRequest, TaskEntity>
{
    private readonly GetTaskByIdUseCase _getTaskByIdUseCase;
    public Task<TaskEntity> Handle(GetTaskByIdRequest request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}