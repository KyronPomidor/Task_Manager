using System;
using MediatR;
using Task_Manager_Back.Application.Queries.TaskCategories;
using Task_Manager_Back.Application.UseCases.TaskUseCases;
using Task_Manager_Back.Domain.Entities.TaskEntity;

namespace Task_Manager_Back.Application.QueryHandlers.TaskCategories;

public class GetTaskCategoriesByUserIdQueryHandler : IRequestHandler<GetTaskCategoriesByUserIdQuery, List<TaskCategoryDto>>
{
    private readonly GetTaskCategoriesByUserIdUseCase _getTaskCategoriesByUserIdUseCase;
    public GetTaskCategoriesByUserIdQueryHandler(GetTaskCategoriesByUserIdUseCase getTaskCategoriesByUserIdUseCase)
    {
        _getTaskCategoriesByUserIdUseCase = getTaskCategoriesByUserIdUseCase;
    }
    public async Task<List<TaskCategoryDto>> Handle(GetTaskCategoriesByUserIdQuery request, CancellationToken cancellationToken)
    {
        List<CustomCategory> taskCategoryList = await _getTaskCategoriesByUserIdUseCase.ExecuteAsync(request.UserId);

        List<TaskCategoryDto> taskCategoryListDto = taskCategoryList
            .Select(tc => new TaskCategoryDto(tc.Id, tc.Title, tc.Description, tc.ParentCategoryId))
            .ToList();

        return taskCategoryListDto;
    }
}
