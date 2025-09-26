using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskUserCategoryRequests;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;

public class PatchTaskUserCategoryUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public PatchTaskUserCategoryUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(PatchTaskUserCategoryRequest request)
    {
        TaskUserCategory category = await _repository.GetByIdAsync(request.CategoryId) as TaskUserCategory
            ?? throw new KeyNotFoundException($"User category with Id '{request.CategoryId}' not found.");

        // Apply only provided changes
        if (request.Title is not null)
            category.Rename(request.Title);

        if (request.Description is not null)
            category.UpdateDescription(request.Description);

        if (request.ParentCategoryId.HasValue)
            category.ChangeParent(request.ParentCategoryId.Value);

        if (request.Color is not null)
            category.ChangeColor(request.Color);

        if (request.PositionOrder.HasValue)
            category.ChangePositionOrder(request.PositionOrder.Value);

        await _repository.UpdateAsync(category);
    }
}
