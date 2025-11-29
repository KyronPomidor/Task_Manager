using System;
using MediatR;

namespace Task_Manager_Back.Application.Queries.TaskCategories;

public record GetTaskCategoriesByUserIdQuery(Guid UserId) : IRequest<List<TaskCategoryDto>>;
public record TaskCategoryDto(
    Guid Id,
    string Title,
    string? Description,
    Guid? ParentCategoryId = null,
    string Color = "#000000",
    int PositionOrder = 0,
    Guid UserId = default,
    IReadOnlyList<string> Categories = null!,
    IReadOnlyList<string> Tasks = null!
)
{
    public TaskCategoryDto(Guid id, string title, string? description, Guid? parentCategoryId)
        : this(
            id,
            title,
            description,
            parentCategoryId,
            "#000000",
            0,
            Guid.Parse("283118eb-f3c5-4447-afa2-f5a93762a5e3"),
            new List<string>().AsReadOnly(),
            new List<string>().AsReadOnly()
        ) { }
}
