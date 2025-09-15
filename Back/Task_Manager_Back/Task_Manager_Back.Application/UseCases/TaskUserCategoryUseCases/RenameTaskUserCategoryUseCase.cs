using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;

namespace Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;
public class RenameTaskUserCategoryUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public RenameTaskUserCategoryUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(RenameTaskUserCategoryRequest request)
    {
        var category = await _repository.GetByIdAsync(request.CategoryId);
        category.Rename(request.NewTitle);
        await _repository.UpdateAsync(category);
    }
}