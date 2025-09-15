using MediatR;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Entities.Categories;


namespace Task_Manager_Back.Application.Requests.CategoryRequests;

public class GetOrCreateInboxForUserHandler
    : IRequestHandler<GetOrCreateInboxForUserRequest, TaskCategory>
{
    private readonly ITaskCategoryRepository _repository;

    public GetOrCreateInboxForUserHandler(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<TaskCategory> Handle(
        GetOrCreateInboxForUserRequest request,
        CancellationToken cancellationToken)
    {
        return (TaskInbox) await _repository.GetByIdAsync(request.UserId);
    }
}
