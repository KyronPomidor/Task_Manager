using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;

namespace Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;
public class UpdateTaskUserCategoryDescriptionUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public UpdateTaskUserCategoryDescriptionUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(UpdateTaskUserCategoryDescriptionRequest request)
    {
        var category = await _repository.GetByIdAsync(request.CategoryId);
        category.UpdateDescription(request.NewDescription);
        await _repository.UpdateAsync(category);
    }
}