using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskAttachment
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string FilePath { get; private set; } = string.Empty;
    public string FileType { get; private set; } = string.Empty;
    public long Size { get; private set; }

    public TaskAttachment(TaskAttachmentCreateParams @params)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params));
        FilePath = string.IsNullOrWhiteSpace(@params.FilePath)
            ? throw new ArgumentNullException(nameof(@params))
            : @params.FilePath;
        FileType = string.IsNullOrWhiteSpace(@params.FileType)
            ? throw new ArgumentNullException(nameof(@params))
            : @params.FileType;
        Size = ValidationHelper.ValidateNonNegative(@params.Size, nameof(@params));
    }

    private TaskAttachment() { }

    public static TaskAttachment LoadFromPersistence(TaskAttachmentState state)
    {
        return new TaskAttachment
        {
            Id = state.Id,
            UserId = state.UserId,
            FilePath = state.FilePath,
            FileType = state.FileType,
            Size = state.Size
        };
    }
}

// Параметры для создания нового Attachment
public record TaskAttachmentCreateParams(Guid UserId, string FilePath, string FileType, long Size);

// Состояние для восстановления из базы
public record TaskAttachmentState(Guid Id, Guid UserId, string FilePath, string FileType, long Size);
