using System;
using MediatR;

namespace Task_Manager_Back.Application.Queries.Tasks;

public record GetTaskByIdQuery(Guid TaskId) : IRequest<TaskDto>;
