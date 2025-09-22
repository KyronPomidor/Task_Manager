using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IServices.ITask;
public interface ITaskGraphService
{
    TaskRelation LinkTasks(TaskEntity from, TaskEntity to);
    TaskRelation UnlinkTasks(TaskEntity from, TaskEntity to);
    bool IsCircularDependency(TaskEntity from, TaskEntity to);
}
