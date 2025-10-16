using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IServices.ITask;
public interface ITaskGraphService
{
    void LinkTasks(TaskEntity from, TaskEntity to);
    void UnlinkTasks(TaskEntity from, TaskEntity to);
    bool IsCircularDependency(TaskEntity from, TaskEntity to);
}
