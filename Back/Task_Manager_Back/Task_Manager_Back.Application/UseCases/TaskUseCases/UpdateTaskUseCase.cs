using System;
using System.Threading.Tasks;
using Task_Manager_Back.Application.Requests.TaskRequests;
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
    /*private readonly ITaskRepository _taskRepository;
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
    }*/
    // The above code is commented because I don't use it now, but I will need it later, now just dirty Update

    private readonly ITaskRepository _taskRepository;
    public UpdateTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    public async Task ExecuteAsync(UpdateTaskRequest request)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request), "Request cannot be null.");

        TaskEntity task = await _taskRepository.GetByIdAsync(request.TaskId)
                          ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");

        var updateParams = new TaskEntityUpdateParams(
            Title: request.Title,
            Description: request.Description,
            Color: request.Color,
            PriorityId: request.PriorityId,
            PriorityLevel: request.PriorityLevel, // TEMP FIELD
            StatusId: request.StatusId,
            CategoryId: request.CategoryId,
            Deadline: request.Deadline,
            Labels: request.LabelIds,   // if request has a collection of labels
            Order: request.OrderPosition,
            IsCompleted: request.IsCompleted,
            IsFailed: request.IsFailed,
            CompletedAt: request.CompletedAt,
            FailedAt: request.FailedAt
        );
        task.Update(updateParams);
        await _taskRepository.UpdateAsync(task);
    }
}
