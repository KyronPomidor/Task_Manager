using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class Reminder
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public DateTime Time { get; set; }
    public string Message { get; set; }
    public Reminder(Guid userId, DateTime time, string message)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Time = time;
        Message = message ?? throw new ArgumentNullException(nameof(message));
    }

}
