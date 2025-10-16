using System;
using MediatR;

namespace Task_Manager_Back.Application.Queries.TaskCategories;

public record GetTaskCategoriesByUserIdQuery(Guid UserId) : IRequest<List<TaskCategoryDto>>;

public record TaskCategoryDto(
    Guid Id,
    string Title,
    string? Description,
    Guid? ParentCategoryId
);