using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskEntity;
using Task_Manager_Back.Domain.Entities.TaskRelated;

// simple addition of reminders. The generative reminders aka each day, each week, each month, each year, etc. are not supported yet.
// It will be in application service layer. This is just a simple addition of a reminder to a task. User manually will add reminder.
// Idea for future: user when add the reminder, can choice for example 'each day' , and then, in the code when notification is sent, this reminder deletes(or sets done and do not deletes) and creates new one.
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
        // request.userId.. we have this info here. We can check if the task belongs to the user. But the repository should do this filtering by userId
        var task = await _taskRepository.GetByIdAsync(request.TaskId)
                   ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");

        var reminder = new TaskReminder(request.TaskId, request.reminderAt, request.Message);

        task.AddReminder(reminder);
        await _taskRepository.UpdateAsync(task);

        return reminder;
    }
}
