using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IServices.ITask;
public interface ITaskSchedulingService
{
    bool IsOverdue(TaskEntity task, DateTime currentTime);
    TimeSpan? GetRemainingTime(TaskEntity task, DateTime currentTime);
}
