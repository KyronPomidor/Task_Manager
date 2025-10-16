using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.DomainServices.TaskServices;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class GetTaskDetailsUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly TaskDomainService _taskDomainService;

    public GetTaskDetailsUseCase(ITaskRepository taskRepository, TaskDomainService taskDomainService)
    {
        _taskRepository = taskRepository;
        _taskDomainService = taskDomainService;
    }
    public async Task ExecuteAsync(Guid taskId)
    {
        TaskEntity task = await _taskRepository.GetByIdAsync(taskId) ?? throw new KeyNotFoundException($"Task with Id '{taskId}' not found.");
        _taskDomainService.MarkFailed(task);
        await _taskRepository.UpdateAsync(task);

        //It is not taking the details. It is just marking the task as failed if the deadline has passed.
        // I don't understand for what purpose this use case is created.
    }
}
