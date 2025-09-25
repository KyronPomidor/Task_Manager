using System;
using Task_Manager_Back.Domain.DomainServices.TaskServices;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class DeleteTaskDependencyUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly TaskDomainService _taskDomainService;
    public DeleteTaskDependencyUseCase(ITaskRepository taskRepository, TaskDomainService taskDomainService)
    {
        _taskRepository = taskRepository;
        _taskDomainService = taskDomainService;
    }
    public async Task ExecuteAsync(Guid fromTaskId, Guid toTaskId)
    {
        var fromTask = await _taskRepository.GetByIdAsync(fromTaskId) ?? throw new KeyNotFoundException($"Task with Id '{fromTaskId}' not found.");
        var toTask = await _taskRepository.GetByIdAsync(toTaskId) ?? throw new KeyNotFoundException($"Task with Id '{toTaskId}' not found.");

        await _taskDomainService.DeleteDependency(fromTask, toTask);

        // Save changes
        await _taskRepository.RemoveDependencyAsync(fromTaskId, toTaskId); // FAST fix, costili. 
        //await _taskRepository.UpdateAsync(fromTask);
        //await _taskRepository.UpdateAsync(toTask); // don't need this, as not edited. But just in case of future changes
    }
}
