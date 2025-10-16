using System;
using MediatR;

namespace Task_Manager_Back.Application.Commands.Tasks;

public record DeleteTaskCommand
(
    Guid TaskId
    //Guid UserId //later
) : IRequest;
