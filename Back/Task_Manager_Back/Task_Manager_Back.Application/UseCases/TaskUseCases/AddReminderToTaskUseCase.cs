using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class AddReminderToTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public AddReminderToTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    // shouldn't the implementation be in Domain (business logic?)
    public async Task<Reminder> ExecuteAsync(Guid taskId, Guid userId, DateTime time, string message)
    {
        return new Reminder
            (
                taskId,
                userId,
                time,
                message ?? throw new ArgumentNullException(nameof(message))
            );

    }
}
