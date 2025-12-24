
namespace Task_Manager_Back.Application.IRepositories;
public interface IRepository<T> where T : class
{
    Task CreateAsync(T entity);
    Task DeleteAsync(T entity);
    Task DeleteByIdAsync(Guid entityId);
    Task<List<T>> GetAllByUserIdAsync(Guid userId);
    Task<T> GetByIdAsync(Guid entityId);
    Task UpdateAsync(T entity);
}