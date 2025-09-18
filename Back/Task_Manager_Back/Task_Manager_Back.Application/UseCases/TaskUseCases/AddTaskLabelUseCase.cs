using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class AddTaskLabelUseCase
{
    private readonly ITaskRepository _taskRepository;

    public AddTaskLabelUseCase(ITaskRepository taskRepository)
    {
        _taskRepository=taskRepository;
    }
    public async Task ExecuteAsync(AddTaskLabelRequest request)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId)
            ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");
        var label = new TaskLabel(new TaskLabelCreateParams(
            request.UserId,
            request.TaskId,
            request.Title,
            request.Description
            ));
        task.AddLabel(label);
        await _taskRepository.UpdateAsync(task);
    }
}