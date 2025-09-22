using System;
using MediatR;
using Task_Manager_Back.Application.Commands.Tasks;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.CommandHandlers.Tasks;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, Guid>
{
    private readonly CreateTaskUseCase _createTaskUseCase;

    public CreateTaskCommandHandler(CreateTaskUseCase createTaskUseCase)
    {
        _createTaskUseCase = createTaskUseCase;
    }

    public async Task<Guid> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        Guid taskId = await _createTaskUseCase.ExecuteAsync(new Application.Requests.TaskRequests.CreateTaskRequest(
            request.UserId,
            request.Title,
            request.Description,
            request.Color,
            request.PriorityId,
            request.StatusId,
            request.CategoryId,
            request.Deadline,
            request.LabelIds,
            request.OrderPosion
        ));

        return taskId;
    }
}
