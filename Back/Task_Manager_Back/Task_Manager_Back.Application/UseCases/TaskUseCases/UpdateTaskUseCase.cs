using System;
using System.Threading.Tasks;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class UpdateTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public UpdateTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task ExecuteAsync(
        Guid taskId,
        Guid userId,
        string? newTitle,
        string? newDescription,
        Guid? newStatusId,
        Guid? newCategoryId,
        DateTime? newDeadline,
        bool? isCompleted,
        bool? isFailed)
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
            task.MarkCompleted();

        if (isFailed == true)
            task.MarkFailed();

        await _taskRepository.UpdateAsync(task);
    }
}
