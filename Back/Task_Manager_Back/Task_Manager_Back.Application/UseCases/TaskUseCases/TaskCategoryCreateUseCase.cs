using System;
using Task_Manager_Back.Domain.DomainServices.TaskServices;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class TaskCategoryCreateUseCase
{
    private readonly ITaskCategoryRepository _categoryRepository;
    private readonly TaskCategoryDomainService _categoryDomainService;
    public TaskCategoryCreateUseCase(ITaskCategoryRepository categoryRepository, TaskCategoryDomainService categoryDomainService)
    {
        _categoryRepository = categoryRepository;
        _categoryDomainService = categoryDomainService;
    }

    public async Task<Guid> ExecuteAsync(Guid userId, string title, string? description = null, Guid? parentCategoryId = null)
    {

        var newCategory = await _categoryDomainService.CreateCustomCategory(
            userId,
            title,
            description,
            parentCategoryId
        );

        var newCategoryId = await _categoryRepository.CreateAsync(newCategory);

        return newCategoryId;
    }
}
