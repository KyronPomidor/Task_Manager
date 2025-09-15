using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Entities.Categories;

namespace Task_Manager_Back.Application.UseCases.Categories;

public class GetTaskUserCategoryByIdUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public GetTaskUserCategoryByIdUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<TaskCategory?> ExecuteAsync(Guid categoryId, CancellationToken cancellationToken = default)
    {
        return (TaskUserCategory) await _repository.GetByIdAsync(categoryId);
    }
}
