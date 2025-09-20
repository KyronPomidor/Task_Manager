using MediatR;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests;
using Task_Manager_Back.Domain.Entities.TaskCategories;


namespace Task_Manager_Back.Application.Handlers;

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
