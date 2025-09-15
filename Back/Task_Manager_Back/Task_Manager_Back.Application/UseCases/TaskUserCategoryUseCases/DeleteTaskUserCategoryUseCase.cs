using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskCategoryRequests;
using Task_Manager_Back.Domain.Entities.Categories;

namespace Task_Manager_Back.Application.UseCases.TaskCategoryUseCases;
public class DeleteTaskUserCategoryUseCase
{
    private readonly ITaskCategoryRepository _repository;

    public DeleteTaskUserCategoryUseCase(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteAsync(DeleteTaskUserCategoryRequest request)
    {
        var category = await _repository.GetByIdAsync(request.CategoryId);

        // Guard: Prevent deleting TaskInbox
        if (category is TaskInbox)
            throw new InvalidOperationException("Cannot delete the Inbox category.");

        await _repository.DeleteAsync(category);
    }
}