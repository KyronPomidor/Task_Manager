using System;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.DomainServices.TaskServices;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

// Use case for updating a task with various optional parameters.
// This class demonstrates how to apply multiple updates to a task entity
// All in one place, if needed (I think that will be preferate Frontend use case)
public class UpdateTaskUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly TaskDomainService _taskDomainService;

    public UpdateTaskUseCase(ITaskRepository taskRepository, TaskDomainService taskDomainService)
    {
        _taskRepository = taskRepository;
        _taskDomainService = taskDomainService;
    }

    public async Task ExecuteAsync
        (
        Guid taskId,
        Guid userId,
        string? newTitle,
        string? newDescription,
        Guid? newStatusId,
        Guid? newCategoryId,
        DateTime? newDeadline,
        bool? isCompleted,
        bool? isFailed
        )
    {
        TaskEntity task = await _taskRepository.GetByIdAsync(taskId)
                          ?? throw new KeyNotFoundException($"Task with Id '{taskId}' not found.");

        // Применяем изменения через доменные методы
        if (!string.IsNullOrWhiteSpace(newTitle))
            task.Rename(newTitle);

        if (newDescription != null)
            task.UpdateDescription(newDescription);

        if (newStatusId.HasValue)
            task.ChangeStatus(newStatusId.Value);

        if (newCategoryId.HasValue)
            task.ChangeCategory(newCategoryId.Value);

        if (newDeadline.HasValue)
            task.ChangeDeadline(newDeadline);

        if (isCompleted == true)
            _taskDomainService.MarkCompleted(task);

        if (isFailed == true)
            _taskDomainService.MarkFailed(task);

        await _taskRepository.UpdateAsync(task);
    }
}
