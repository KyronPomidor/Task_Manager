using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;


// Too much time to implement file storage, so just not use this class for now
// or... already yes?
public class TaskAttachment //consider taking attachment functionality from TicketingSystem
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public Guid TaskId { get; private set; }  // <- new FK, why not? Even if it is aggregate. 

    public string FilePath { get; private set; }
    public string FileType { get; private set; }
    public string FileName { get; private set; } // derived property for now, but may be requested from Front. 
    public long? Size { get; private set; } // idk, maybe useful. Nullable, as for now. In future, when we will understand how to count the size of file in storage, we will make it non-nullable.
    public TaskAttachment(Guid userId, Guid taskId, string filePath, string fileType, string? fileName = null, long? size = null)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        TaskId = taskId;
        FilePath = filePath ?? throw new ArgumentNullException(nameof(filePath));
        FileType = fileType ?? throw new ArgumentNullException(nameof(fileType));
        FileName = fileName ?? System.IO.Path.GetFileName(FilePath);
        Size = size;
    }

    public static TaskAttachment LoadFromPersistence(Guid id, Guid userId, Guid taskId, string filePath, string fileType, string? fileName, long? size)
    {
        var attachment = new TaskAttachment(userId, taskId, filePath, fileType, fileName, size);
        attachment.Id = id;
        return attachment;
    }

}
