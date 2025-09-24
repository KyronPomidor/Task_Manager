using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.UseCases.TaskUserCategoryUseCases;
public class GetTaskUserCategoriesUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public GetTaskUserCategoriesUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }
    public async Task<IReadOnlyList<TaskUserCategory>> ExecuteAsync(CancellationToken cancellationToken)
    {
        var categories = await _repository.GetAllAsync();
        var userCategories = categories
            .OfType<TaskUserCategory>()
            .ToList()
            .AsReadOnly();

        return userCategories;
    }
}