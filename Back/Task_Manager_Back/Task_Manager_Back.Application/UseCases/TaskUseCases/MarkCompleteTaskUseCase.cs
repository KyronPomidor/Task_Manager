using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.DomainServices.TaskServices;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

// simple mark completed. use Domain Service.
public class MarkCompleteTaskUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly TaskDomainService _taskDomainService;

    public MarkCompleteTaskUseCase(ITaskRepository taskRepository, TaskDomainService taskDomainService)
    {
        _taskRepository = taskRepository;
        _taskDomainService = taskDomainService;
    }
    public async Task ExecuteAsync(Guid taskId)
    {
        TaskEntity task = await _taskRepository.GetByIdAsync(taskId) ?? throw new KeyNotFoundException($"Task with Id '{taskId}' not found.");
        _taskDomainService.MarkCompleted(task);

        await _taskRepository.UpdateAsync(task);
    }
}
