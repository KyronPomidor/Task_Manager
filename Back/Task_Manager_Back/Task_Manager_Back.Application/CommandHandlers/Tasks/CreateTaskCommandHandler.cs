using System;
using MediatR;
using Task_Manager_Back.Application.Commands.Tasks;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.CommandHandlers.Tasks;

public class CreateTaskCommandHandler : IRequestHandler<CreateTaskCommand, Guid>
{
    private readonly CreateTaskUseCase _createTaskUseCase;

    public CreateTaskCommandHandler(CreateTaskUseCase createTaskUseCase)
    {
        _createTaskUseCase = createTaskUseCase;
    }

    public async Task<Guid> Handle(CreateTaskCommand command, CancellationToken cancellationToken)
    {
        var createRequest = new CreateTaskRequest(
            UserId: command.UserId,
            Title: command.Title,
            Description: command.Description,
            Color: command.Color,  //TODO: do it optional
            PriorityId: command.PriorityId,
            PriorityLevel: command.PriorityLevel, // TEMPORARY
            StatusId: command.StatusId,
            CategoryId: command.CategoryId,
            Deadline: command.Deadline,
            LabelIds: command.LabelIds,
            OrderPosition: command.OrderPosition
        );

        Guid taskId = await _createTaskUseCase.ExecuteAsync(createRequest);


        return taskId;
    }
}
