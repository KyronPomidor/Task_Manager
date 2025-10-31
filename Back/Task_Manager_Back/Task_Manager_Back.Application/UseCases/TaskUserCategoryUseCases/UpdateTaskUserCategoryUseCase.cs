using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

public class UpdateTaskUserCategoryUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public UpdateTaskUserCategoryUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(UpdateTaskUserCategoryRequest request)
    {
        TaskUserCategory category = await _repository.GetByIdAsync(request.CategoryId) as TaskUserCategory
            ?? throw new KeyNotFoundException($"User category with Id '{request.CategoryId}' not found.");

        // Apply full update through domain methods
        category.Rename(request.Title);
        category.UpdateDescription(request.Description);
        category.ChangeParent(request.ParentCategoryId);
        category.ChangeColor(request.Color);
        category.ChangePositionOrder(request.PositionOrder);

        await _repository.UpdateAsync(category);
    }
}
