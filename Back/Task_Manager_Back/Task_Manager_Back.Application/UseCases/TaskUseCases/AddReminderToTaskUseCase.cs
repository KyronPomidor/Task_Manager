using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class AddTaskReminderUseCase
{
    private readonly ITaskRepository _taskRepository;

    public AddTaskReminderUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task<TaskReminder> ExecuteAsync(AddTaskReminderRequest request)
    {
        var task = await _taskRepository.GetByIdAsync(request.TaskId)
                   ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");

        var reminder = new TaskReminder(new TaskReminderCreateParams(
        
            request.TaskId,
            request.UserId,
            request.Time,
            request.Message
        ));

        task.AddReminder(reminder);
        await _taskRepository.UpdateAsync(task);

        return reminder;
    }
}
