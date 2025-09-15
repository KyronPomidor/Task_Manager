using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;
using Task_Manager_Back.Domain.Entities.Categories;

namespace Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;
public class ChangeTaskUserCategoryParentUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public ChangeTaskUserCategoryParentUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(ChangeTaskCategoryParentRequest request)
    {
        var category = (TaskUserCategory) await _repository.GetByIdAsync(request.CategoryId);
        if (category is not TaskUserCategory userCategory)
            throw new InvalidOperationException("Only user categories can have parent categories changed.");

        userCategory.ChangeParent(request.NewParentCategoryId);

        await _repository.UpdateAsync(userCategory);
    }
}