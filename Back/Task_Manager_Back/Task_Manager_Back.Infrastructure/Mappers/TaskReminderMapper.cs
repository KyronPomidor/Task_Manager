using System;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Infrastructure.DatabaseEntities;

namespace Task_Manager_Back.Infrastructure.Mappers;

public static class TaskReminderMapper
{
    public static DatabaseTaskReminder ToDbEntity(this TaskReminder reminder, Guid taskId)
    {
        return new DatabaseTaskReminder
        {
            Id = reminder.Id,
            TaskId = taskId,
            ReminderAt = reminder.ReminderAt,
            Message = reminder.Message,
            IsSent = reminder.IsSent
        };
    }

    public static TaskReminder ToDomain(this DatabaseTaskReminder dbReminder)
    {
        return TaskReminder.LoadFromPersistence(dbReminder.Id, dbReminder.TaskId, dbReminder.ReminderAt, dbReminder.Message, dbReminder.IsSent);
    }
}
