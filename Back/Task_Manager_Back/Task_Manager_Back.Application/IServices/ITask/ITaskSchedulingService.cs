using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.IServices.ITask;
public interface ITaskSchedulingService
{
    bool IsOverdue(Domain.Aggregates.TaskAggregate.Task task, DateTime currentTime);
    TimeSpan? GetRemainingTime(Domain.Aggregates.TaskAggregate.Task task, DateTime currentTime);
}
