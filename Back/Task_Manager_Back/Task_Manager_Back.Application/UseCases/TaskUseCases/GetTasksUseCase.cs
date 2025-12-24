using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class GetTasksUseCase
{
    private readonly ITaskRepository _taskRepository;

    public GetTasksUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<IReadOnlyList<TaskEntity>> ExecuteAsync(GetTasksByUserIdRequest request)
    {
        // Позже тут можно будет добавить фильтрацию
        return await _taskRepository.GetAllByUserIdAsync(request.UserId);
    }
}

