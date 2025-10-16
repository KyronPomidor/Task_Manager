using System;
using MediatR;

namespace Task_Manager_Back.Application.Commands.Tasks;

public record CreateTaskDependencyCommand(
    Guid TaskId,
    Guid DependsOnTaskId
) : IRequest;
