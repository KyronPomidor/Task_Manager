using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;
public class ChangeTaskUserCategoryColorUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public ChangeTaskUserCategoryColorUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(ChangeTaskUserCategoryColorRequest request)
    {
        var category = await _repository.GetByIdAsync(request.CategoryId);

        if (category is not TaskUserCategory userCategory)
            throw new InvalidOperationException("Only user categories can have their color changed.");

        userCategory.ChangeColor(request.NewColor);

        await _repository.UpdateAsync(userCategory);
    }

}