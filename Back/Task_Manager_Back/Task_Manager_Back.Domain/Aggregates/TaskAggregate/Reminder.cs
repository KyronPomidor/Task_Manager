using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class Reminder
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public DateTime Time { get; set; }
    public string Message { get; set; }
}
