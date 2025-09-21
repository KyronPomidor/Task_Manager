using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Entities.TaskEntity;

public class TaskStatus
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title {  get; private set; }
    public string? Description { get; private set; }
    public TaskStatus(Guid userId, string title, string? description)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description;
    }
}
