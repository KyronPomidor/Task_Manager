using System;
using MediatR;
using Task_Manager_Back.Application.Commands.TaskCategories;
using Task_Manager_Back.Application.UseCases.TaskUseCases;

namespace Task_Manager_Back.Application.CommandHandlers.TaskCategories;

public class CreateTaskCategoryCommandHandler : IRequestHandler<CreateTaskCategoryCommand, Guid>
{
    private readonly TaskCategoryCreateUseCase _createUseCase;
    public CreateTaskCategoryCommandHandler(TaskCategoryCreateUseCase createUseCase)
    {
        _createUseCase = createUseCase;
    }
    public async Task<Guid> Handle(CreateTaskCategoryCommand command, CancellationToken cancellationToken)
    {
        Guid Categoryid = await _createUseCase.ExecuteAsync(command.UserId, command.Title, command.Description, command.ParentCategoryId);
        return Categoryid;
    }
}
