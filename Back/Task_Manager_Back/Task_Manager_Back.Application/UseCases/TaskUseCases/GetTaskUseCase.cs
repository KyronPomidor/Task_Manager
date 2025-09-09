using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class GetTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public GetTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<TaskEntity> ExecuteAsync(GetTaskByIdRequest request)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId)
                   ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");

        return task;
    }
}

