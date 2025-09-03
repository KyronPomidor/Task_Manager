using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class Status
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title {  get; set; }
    public string? Description { get; set; }
}
