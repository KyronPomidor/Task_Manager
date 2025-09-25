using System;
using MediatR;

namespace Task_Manager_Back.Application.Commands.TaskCategories;

public record CreateTaskCategoryCommand(
    Guid UserId,
    string Title,
    string? Description = null,
    Guid? ParentCategoryId = null
) : IRequest<Guid>;
