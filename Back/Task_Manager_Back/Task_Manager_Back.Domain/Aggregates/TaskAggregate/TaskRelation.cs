using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class TaskRelation
{
    public Guid FromTaskId { get; set; }
    public Guid ToTaskId { get; set; }
}
