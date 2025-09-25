using System;
using MediatR;

namespace Task_Manager_Back.Application.Commands.Tasks;

public record AssignTaskToCategoryCommand(Guid TaskId, Guid? CategoryId) : IRequest; //Null means Inbox
