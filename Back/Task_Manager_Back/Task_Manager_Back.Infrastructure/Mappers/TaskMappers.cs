using System;
using System;
using System.Collections.Generic;
using System.Linq;
using global::Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using global::Task_Manager_Back.Domain.Entities.TaskRelated;
using global::Task_Manager_Back.Infrastructure.DatabaseEntities;

namespace Task_Manager_Back.Infrastructure.Mappers;

public static class TaskMappers
{
    // Основной маппер для TaskEntity <-> DatabaseTaskEntity
    public static DatabaseTaskEntity ToDbEntity(this TaskEntity task)
    {
        if (task == null) throw new ArgumentNullException(nameof(task));

        var dbEntity = new DatabaseTaskEntity
        {
            Id = task.Id,
            UserId = task.UserId,
            Title = task.Title,
            Description = task.Description,
            Color = task.Color ?? "#FFFFFF",  // Дефолт в БД, если null (но домен уже генерит random)
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
            PositionOrder = task.PositionOrder
        };

        // Labels: many-to-many join
        dbEntity.Labels = task.LabelIds
            ?.Select(labelId => new DatabaseTaskTaskLabel { TaskId = task.Id, LabelId = labelId })
            .ToList() ?? new List<DatabaseTaskTaskLabel>();

        // Вложенные коллекции (EF каскадно добавит)
        dbEntity.Reminders = task.Reminders
            ?.Select(r => r.ToDbEntity()).ToList() ?? new List<DatabaseTaskReminder>();

        dbEntity.Attachments = task.Attachments
            ?.Select(a => a.ToDbEntity()).ToList() ?? new List<DatabaseTaskAttachment>();

        dbEntity.Dependencies = task.Dependencies
            ?.Select(d => d.ToDbEntity()).ToList() ?? new List<DatabaseTaskDependencyRelation>();

        dbEntity.CustomRelations = task.CustomRelations
            ?.Select(c => c.ToDbEntity()).ToList() ?? new List<DatabaseTaskCustomRelation>();

        return dbEntity;
    }

    public static TaskEntity ToDomain(this DatabaseTaskEntity dbEntity)
    {
        if (dbEntity == null) throw new ArgumentNullException(nameof(dbEntity));

        // Создаём state для consistency
        var state = new TaskEntityState(
            id: dbEntity.Id,
            userId: dbEntity.UserId,
            title: dbEntity.Title,
            description: dbEntity.Description,
            color: dbEntity.Color,
            isCompleted: dbEntity.IsCompleted,
            isFailed: dbEntity.IsFailed,
            priorityId: dbEntity.PriorityId,
            statusId: dbEntity.StatusId,
            categoryId: dbEntity.CategoryId,
            createdAt: dbEntity.CreatedAt,
            updatedAt: dbEntity.UpdatedAt,
            deadline: dbEntity.Deadline,
            completedAt: dbEntity.CompletedAt,
            failedAt: dbEntity.FailedAt,
            labels: dbEntity.Labels?.Select(l => l.LabelId) ?? Enumerable.Empty<Guid>(),
            reminders: dbEntity.Reminders?.Select(r => r.ToDomain()) ?? Enumerable.Empty<TaskReminder>(),
            attachments: dbEntity.Attachments?.Select(a => a.ToDomain()) ?? Enumerable.Empty<TaskAttachment>(),
            dependencies: dbEntity.Dependencies?.Select(d => d.ToDomain()) ?? Enumerable.Empty<TaskDependencyRelation>(),
            customRelations: dbEntity.CustomRelations?.Select(c => c.ToDomain()) ?? Enumerable.Empty<TaskCustomRelation>(),
            order: dbEntity.PositionOrder
        );

        return TaskEntity.LoadFromPersistence(state);
    }

    // Мапперы для вложенных сущностей (твои, но с null-checks)
    public static DatabaseTaskReminder ToDbEntity(this TaskReminder reminder)
    {
        if (reminder == null) throw new ArgumentNullException(nameof(reminder));
        return new DatabaseTaskReminder
        {
            Id = reminder.Id,
            TaskId = reminder.TaskId,
            ReminderAt = reminder.ReminderAt,
            Message = reminder.Message,
            IsSent = reminder.IsSent
        };
    }

    public static TaskReminder ToDomain(this DatabaseTaskReminder dbReminder)
    {
        if (dbReminder == null) throw new ArgumentNullException(nameof(dbReminder));
        return TaskReminder.LoadFromPersistence(dbReminder.Id, dbReminder.TaskId, dbReminder.ReminderAt, dbReminder.Message, dbReminder.IsSent);
    }

    public static DatabaseTaskAttachment ToDbEntity(this TaskAttachment attachment)
    {
        if (attachment == null) throw new ArgumentNullException(nameof(attachment));
        return new DatabaseTaskAttachment
        {
            Id = attachment.Id,
            UserId = attachment.UserId,
            TaskId = attachment.TaskId,
            FilePath = attachment.FilePath,
            FileType = attachment.FileType,
            FileName = attachment.FileName,
            Size = attachment.Size
        };
    }

    public static TaskAttachment ToDomain(this DatabaseTaskAttachment dbAttachment)
    {
        if (dbAttachment == null) throw new ArgumentNullException(nameof(dbAttachment));
        return TaskAttachment.LoadFromPersistence(dbAttachment.Id, dbAttachment.UserId, dbAttachment.TaskId, dbAttachment.FilePath, dbAttachment.FileType, dbAttachment.FileName, dbAttachment.Size);
    }

    public static DatabaseTaskDependencyRelation ToDbEntity(this TaskDependencyRelation dep)
    {
        if (dep == null) throw new ArgumentNullException(nameof(dep));
        return new DatabaseTaskDependencyRelation
        {
            FromTaskId = dep.FromTaskId,
            ToTaskId = dep.ToTaskId
        };
    }

    public static TaskDependencyRelation ToDomain(this DatabaseTaskDependencyRelation dbDep)
    {
        if (dbDep == null) throw new ArgumentNullException(nameof(dbDep));
        return TaskDependencyRelation.LoadFromPersistence(dbDep.FromTaskId, dbDep.ToTaskId);
    }

    public static DatabaseTaskCustomRelation ToDbEntity(this TaskCustomRelation custom)
    {
        if (custom == null) throw new ArgumentNullException(nameof(custom));
        return new DatabaseTaskCustomRelation
        {
            FromTaskId = custom.FromTaskId,
            ToTaskId = custom.ToTaskId,
            RelationTypeId = custom.RelationTypeId
        };
    }

    public static TaskCustomRelation ToDomain(this DatabaseTaskCustomRelation dbCustom)
    {
        if (dbCustom == null) throw new ArgumentNullException(nameof(dbCustom));
        return TaskCustomRelation.LoadFromPersistence(dbCustom.FromTaskId, dbCustom.ToTaskId, dbCustom.RelationTypeId);
    }

    // Если нужно для других сущностей (e.g. RelationType), добавь аналогично
}