using System;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class GetTasksByUserIdUseCase
{
    private readonly ITaskRepository _taskRepository;

    public GetTasksByUserIdUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<List<TaskEntity>> ExecuteAsync(Guid userId)
    {
        var tasks = await _taskRepository.GetAllAsync(userId);
        if (tasks == null)
            throw new KeyNotFoundException("Tasks not found for user with id: " + userId);

        return tasks;
    }
}
