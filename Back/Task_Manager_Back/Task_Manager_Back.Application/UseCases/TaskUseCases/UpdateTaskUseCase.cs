using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class UpdateTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public UpdateTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task ExecuteAsync(UpdateTaskRequest request)
    {
        TaskEntity task = await _taskRepository.GetByIdAsync(request.TaskId)
            ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");

        // Применяем изменения через доменные методы
        task.Rename(request.NewTitle);
        task.UpdateDescription(request.NewDescription);
        task.ChangeStatus(request.NewStatusId);
        task.ChangeCategory(request.NewCategoryId);
        task.ChangeDeadline(request.NewDeadline);
        task.ChangePriority(request.NewPriority);
        task.ChangeColor(request.NewColor);
        task.ChangePositionOrder(request.NewPositionOrder);
        task.SetIsCompleted(request.IsCompleted);
        task.SetIsFailed(request.IsCompleted);
        task.SetDependsOnTasksIds(request.NewDependsOnTasksIds); // NEW


        await _taskRepository.UpdateAsync(task);
    }
}
