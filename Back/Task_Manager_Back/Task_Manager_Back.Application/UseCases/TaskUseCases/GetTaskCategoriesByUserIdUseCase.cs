using System;
using Task_Manager_Back.Domain.Entities.TaskEntity;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class GetTaskCategoriesByUserIdUseCase
{
    private readonly ITaskCategoryRepository _categoryRepository;
    public GetTaskCategoriesByUserIdUseCase(ITaskCategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<List<CustomCategory>> ExecuteAsync(Guid userId)
    {
        var categories = await _categoryRepository.GetAllAsync(userId);
        if (categories == null)
            throw new KeyNotFoundException("Categories not found for user with id: " + userId);
        return categories;
    }

}
