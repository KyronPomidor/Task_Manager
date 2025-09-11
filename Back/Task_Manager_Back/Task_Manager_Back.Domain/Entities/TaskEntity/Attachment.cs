using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;


// Too much time to implement file storage, so just not use this class for now
public class Attachment //consider taking attachment functionality from TicketingSystem
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string FilePath { get; private set; }
    public string FileType { get; private set; }
    public long Size { get; private set; }
    public Attachment(Guid userId, string filePath, string fileType, long size)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        FilePath = filePath ?? throw new ArgumentNullException(nameof(filePath));
        FileType = fileType ?? throw new ArgumentNullException(nameof(fileType));
        Size = size;
    }

}
