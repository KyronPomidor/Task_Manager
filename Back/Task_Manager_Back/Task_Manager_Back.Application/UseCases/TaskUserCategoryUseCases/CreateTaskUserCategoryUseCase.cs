using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;
using Task_Manager_Back.Domain.Entities.Categories;

namespace Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;
public class CreateTaskUserCategoryUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public CreateTaskUserCategoryUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(CreateTaskUserCategoryRequest request)
    {
        var category = new TaskUserCategory(new TaskUserCategoryCreateParams(
            request.UserId,
            request.Title,
            request.Description,
            request.ParentCategoryId,
            request.Color
        ));

        await _repository.CreateAsync(category);
    }
}