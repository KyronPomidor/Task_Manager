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

    public async Task<Guid> ExecuteAsync(CreateTaskUserCategoryRequest request)
    {
        var category = new TaskUserCategory(new TaskUserCategoryCreateParams(
            UserId: request.UserId,
            Title: request.Title,
            Description: request.Description,
            ParentCategoryId: request.ParentCategoryId,
            Color: request.Color
        ));

        await _repository.CreateAsync(category);

        return category.Id; // return the Guid
    }
}
