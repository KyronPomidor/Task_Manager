

using MediatR;

namespace Task_Manager_Back.Application.Commands.Tasks;
public record DeleteTaskDependencyCommand(
    Guid TaskId,
    Guid DependsOnTaskId
) : IRequest;
