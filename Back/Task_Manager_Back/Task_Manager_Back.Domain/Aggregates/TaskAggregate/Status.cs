using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class Status
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title {  get; private set; }
    public string? Description { get; private set; }
    public Status(Guid userId, string title, string? description)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description;
    }
}
