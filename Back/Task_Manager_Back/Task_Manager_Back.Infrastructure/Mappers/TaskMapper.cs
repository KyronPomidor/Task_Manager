using System;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Infrastructure.DatabaseEntities;

namespace Task_Manager_Back.Infrastructure.Mappers;

public static class TaskEntityMapper
{
    public static DatabaseTaskEntity ToDbEntity(this TaskEntity task)
    {
        return new DatabaseTaskEntity
        {
            Id = task.Id,
            UserId = task.UserId,
            Title = task.Title,
            Description = task.Description,
            Color = task.Color,
            IsCompleted = task.IsCompleted,
            IsFailed = task.IsFailed,
            PriorityId = task.PriorityId,
            StatusId = task.StatusId,
            CategoryId = task.CategoryId,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt,
            Deadline = task.Deadline,
            CompletedAt = task.CompletedAt,
            FailedAt = task.FailedAt,
            PositionOrder = task.PositionOrder,
            Labels = task.LabelIds
                .Select(id => new DatabaseTaskTaskLabel { TaskId = task.Id, LabelId = id })
                .ToList(),
            Reminders = task.Reminders.Select(r => r.ToDbEntity(task.Id)).ToList(),
            Attachments = task.Attachments.Select(a => a.ToDbEntity()).ToList(),
            Dependencies = task.Dependencies.Select(d => d.ToDbEntity()).ToList(),
            CustomRelations = task.CustomRelations.Select(c => c.ToDbEntity()).ToList()
        };
    }

    public static TaskEntity ToDomain(this DatabaseTaskEntity db)
    {
        var labelIds = db.Labels?.Select(l => l.LabelId) ?? Enumerable.Empty<Guid>();

        var task = TaskEntity.LoadFromPersistence(
            db.Id,
            db.UserId,
            db.Title,
            db.Description,
            db.Color,
            db.IsCompleted,
            db.IsFailed,
            db.PriorityId ?? Guid.Empty,
            db.StatusId ?? Guid.Empty,
            db.CategoryId,
            db.CreatedAt,
            db.UpdatedAt,
            db.Deadline,
            db.CompletedAt,
            db.FailedAt,
            labelIds,
            db.Reminders?.Select(r => r.ToDomain()),
            db.Attachments?.Select(a => a.ToDomain()),
            db.Dependencies?.Select(d => d.ToDomain()),
            db.CustomRelations?.Select(c => c.ToDomain()),
            db.PositionOrder
        );
        return task;
    }
}