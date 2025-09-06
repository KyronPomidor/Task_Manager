using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Domain.IServices.ITask;
public interface ITaskGraphService
{
    void LinkTasks(Aggregates.TaskAggregate.Task from, Aggregates.TaskAggregate.Task to);
    void UnlinkTasks(Aggregates.TaskAggregate.Task from, Aggregates.TaskAggregate.Task to);
    bool IsCircularDependency(Aggregates.TaskAggregate.Task from, Aggregates.TaskAggregate.Task to);
}
