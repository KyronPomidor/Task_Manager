using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class UpdateTaskUseCase
{
    private readonly ITaskEntityRepository _taskRepository;

    public UpdateTaskUseCase(ITaskEntityRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task ExecuteAsync(UpdateTaskRequest request)
    {
        TaskEntity task = await _taskRepository.GetByIdAsync(request.TaskId)
            ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");

        // Применяем изменения через доменные методы
        if (!string.IsNullOrWhiteSpace(request.NewTitle))
            task.Rename(request.NewTitle);

        if (request.NewDescription is not null)
            task.UpdateDescription(request.NewDescription);

        if (request.NewStatusId.HasValue)
            task.ChangeStatus(request.NewStatusId.Value);

        if (request.NewCategoryId.HasValue)
            task.ChangeCategory(request.NewCategoryId.Value);

        if (request.NewDeadline.HasValue)
            task.ChangeDeadline(request.NewDeadline);

        if (request.IsCompleted == true)
            task.MarkCompleted();

        if (request.IsFailed == true)
            task.MarkFailed();

        await _taskRepository.UpdateAsync(task);
    }
}
