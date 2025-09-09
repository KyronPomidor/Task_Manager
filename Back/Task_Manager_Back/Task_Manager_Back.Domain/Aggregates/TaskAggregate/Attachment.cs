namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

//changed to public because getting Inconsistent accessibility error in LoadFromPersistence
public class Attachment
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string FilePath { get; private set; }
    public string FileType { get; private set; }
    public long Size { get; private set; }

    public Attachment(Guid userId, string filePath, string fileType, long size)
    {
        Id = Guid.NewGuid();
        UserId = userId == Guid.Empty ? throw new ArgumentException("UserId required", nameof(userId)) : userId;
        FilePath = string.IsNullOrWhiteSpace(filePath) ? throw new ArgumentNullException(nameof(filePath)) : filePath;
        FileType = string.IsNullOrWhiteSpace(fileType) ? throw new ArgumentNullException(nameof(fileType)) : fileType;
        Size = size < 0 ? throw new ArgumentException("Size cannot be negative", nameof(size)) : size;
    }

    public static Attachment LoadFromPersistence(Guid id, Guid userId, string filePath, string fileType, long size)
    {
        return new Attachment
        {
            Id = id,
            UserId = userId,
            FilePath = filePath,
            FileType = fileType,
            Size = size
        };
    }

    private Attachment() { }
}
