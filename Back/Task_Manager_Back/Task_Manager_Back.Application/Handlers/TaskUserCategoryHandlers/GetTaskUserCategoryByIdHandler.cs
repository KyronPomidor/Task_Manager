using MediatR;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Entities.Categories;

namespace Task_Manager_Back.Application.Requests.CategoryRequests;

public class GetTaskUserCategoryByIdHandler
    : IRequestHandler<GetTaskUserCategoryByIdRequest, TaskUserCategory?>
{
    private readonly ITaskCategoryRepository _repository;

    public GetTaskUserCategoryByIdHandler(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<TaskUserCategory?> Handle(
        GetTaskUserCategoryByIdRequest request,
        CancellationToken cancellationToken)
    {
        return (TaskUserCategory) await _repository.GetByIdAsync(request.CategoryId);
    }
}
