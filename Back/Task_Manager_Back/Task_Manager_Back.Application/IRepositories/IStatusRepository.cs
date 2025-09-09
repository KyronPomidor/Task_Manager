namespace Task_Manager_Back.Application.IRepositories;
public interface IStatusRepository
{
    TaskStatus GetById(Guid id);
    List<TaskStatus> GetByUser(Guid userId);
    void Add(TaskStatus status);
    void Update(TaskStatus status);
    void Delete(TaskStatus status);
}
