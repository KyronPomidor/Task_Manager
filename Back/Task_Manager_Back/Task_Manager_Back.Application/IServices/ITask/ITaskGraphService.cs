using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.IServices.ITask;
public interface ITaskGraphService
{
    void LinkTasks(Domain.Aggregates.TaskAggregate.Task from, Domain.Aggregates.TaskAggregate.Task to);
    void UnlinkTasks(Domain.Aggregates.TaskAggregate.Task from, Domain.Aggregates.TaskAggregate.Task to);
    bool IsCircularDependency(Domain.Aggregates.TaskAggregate.Task from, Domain.Aggregates.TaskAggregate.Task to);
}
