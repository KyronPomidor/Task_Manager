using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskAttachment
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid TaskId { get; private set; }  // <- new FK
    public string FilePath { get; private set; } = string.Empty;
    public string FileType { get; private set; } = string.Empty;
    public long Size { get; private set; }

    public TaskAttachment(TaskAttachmentCreateParams @params)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params));
        TaskId = ValidationHelper.ValidateGuid(@params.TaskId, nameof(@params));  // <- set FK
        FilePath = string.IsNullOrWhiteSpace(@params.FilePath)
            ? throw new ArgumentNullException(nameof(@params.FilePath))
            : @params.FilePath;
        FileType = string.IsNullOrWhiteSpace(@params.FileType)
            ? throw new ArgumentNullException(nameof(@params.FileType))
            : @params.FileType;
        Size = ValidationHelper.ValidateNonNegative(@params.Size, nameof(@params.Size));
    }

    private TaskAttachment() { }

    public static TaskAttachment LoadFromPersistence(TaskAttachmentState state)
    {
        return new TaskAttachment
        {
            Id = state.Id,
            UserId = state.UserId,
            TaskId = state.TaskId, // <- restore FK
            FilePath = state.FilePath,
            FileType = state.FileType,
            Size = state.Size
        };
    }
}

// Параметры для создания нового Attachment
public record TaskAttachmentCreateParams(Guid UserId, Guid TaskId, string FilePath, string FileType, long Size);

// Состояние для восстановления из базы
public record TaskAttachmentState(Guid Id, Guid UserId, Guid TaskId, string FilePath, string FileType, long Size);
