using Task_Manager_Back.Domain.Entities.TaskCategories;

namespace Task_Manager_Back.Application.IRepositories;
public interface ITaskCategoryRepository : IRepository<TaskCategory>
{
    Task<TaskInbox> GetOrCreateInboxByUserId(Guid userId);
}
