using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class GetTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public GetTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    //TODO: use GetTaskRequest
    public async Task<TaskEntity> ExecuteAsync(Guid taskId)
    {
        if (taskId == Guid.Empty)
            throw new ArgumentException("Task ID cannot be empty");

        var task = await _taskRepository.GetByIdAsync(taskId);
        if (task == null)
            throw new KeyNotFoundException($"Task with ID {taskId} not found");
            
        return task;
        // umm.. is this use case? It is just a pass through to the repository...
        // but ok, it is a use case, it is just a simple one...
        // but still, it is a bit of an anti-pattern...
        // may be to pass through to the repository is not a use case...
        // or to pass through the Domain Service is a use case...
    }
}
