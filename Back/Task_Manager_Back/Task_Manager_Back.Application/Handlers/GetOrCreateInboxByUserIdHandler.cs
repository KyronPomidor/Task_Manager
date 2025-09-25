using MediatR;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests;
using Task_Manager_Back.Domain.Entities.TaskCategories;


namespace Task_Manager_Back.Application.Handlers;

public class GetOrCreateInboxByUserIdHandler
    : IRequestHandler<GetOrCreateInboxByUserIdRequest, TaskCategory>
{
    private readonly ITaskCategoryRepository _repository;

    public GetOrCreateInboxByUserIdHandler(ITaskCategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<TaskCategory> Handle(
        GetOrCreateInboxByUserIdRequest request,
        CancellationToken cancellationToken)
    {
        return await _repository.GetOrCreateInboxByUserId(request.UserId);
    }
}
