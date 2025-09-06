using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class MarkCompleteTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public MarkCompleteTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    public async Task ExecuteAsync(Guid taskId)
    {
        TaskEntity task = await _taskRepository.GetByIdAsync(taskId) ?? throw new KeyNotFoundException($"Task with Id '{taskId}' not found.");
        task.MarkCompleted();
        await _taskRepository.UpdateAsync(task);
    }
}
