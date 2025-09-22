using System;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Infrastructure.DatabaseEntities;

namespace Task_Manager_Back.Infrastructure.Mappers;

public static class TaskAttachmentMapper
{
    public static DatabaseTaskAttachment ToDbEntity(this TaskAttachment attachment)
    {
        return new DatabaseTaskAttachment
        {
            Id = attachment.Id,
            TaskId = attachment.TaskId,
            UserId = attachment.UserId,
            FilePath = attachment.FilePath,
            FileType = attachment.FileType,
            FileName = attachment.FileName,
            Size = attachment.Size
        };
    }

    public static TaskAttachment ToDomain(this DatabaseTaskAttachment dbAttachment)
    {
        return TaskAttachment.LoadFromPersistence(dbAttachment.Id, dbAttachment.UserId, dbAttachment.TaskId, dbAttachment.FilePath, dbAttachment.FileType, dbAttachment.FileName, dbAttachment.Size);
    }
}