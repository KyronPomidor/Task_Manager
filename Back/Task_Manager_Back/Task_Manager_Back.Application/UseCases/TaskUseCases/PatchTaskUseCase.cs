using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class PatchTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public PatchTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task ExecuteAsync(PatchTaskRequest request)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId)
            ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");

        if (request.Title is not null)
            task.Rename(request.Title);

        if (request.Description is not null)
            task.UpdateDescription(request.Description);

        if (request.StatusId.HasValue)
            task.ChangeStatus(request.StatusId.Value);

        if (request.Priority.HasValue)
            task.ChangePriority(request.Priority.Value);

        if (request.CategoryId.HasValue)
            task.ChangeCategory(request.CategoryId.Value);

        if (request.Deadline.HasValue)
            task.ChangeDeadline(request.Deadline.Value);

        if (request.MarkCompleted == true)
            task.MarkCompleted();

        if (request.MarkFailed == true)
            task.MarkFailed();

        await _taskRepository.UpdateAsync(task);
    }
}
