using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IServices.ITask;

namespace Task_Manager_Back.Domain.Graph.Services;
public class TaskGraphService : ITaskGraphService
{
    public bool IsCircularDependency(TaskEntity from, TaskEntity to)
    {
        throw new NotImplementedException();
    }

    public TaskRelation LinkTasks(TaskEntity from, TaskEntity to)
    {
        throw new NotImplementedException();
    }

    public TaskRelation UnlinkTasks(TaskEntity from, TaskEntity to)
    {
        throw new NotImplementedException();
    }
}