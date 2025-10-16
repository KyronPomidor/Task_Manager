using System;
using Task_Manager_Back.Domain.Entities.TaskEntity;

namespace Task_Manager_Back.Domain.IRepositories;

public interface ITaskCategoryRepository
{    
    Task<List<CustomCategory>> GetAllAsync(Guid userId); // get all tasks for a user, version for all users is a little dangerous and meaningless
    Task<CustomCategory> GetByIdAsync(Guid id);
    Task<Guid> CreateAsync(CustomCategory task); // <-- возвращаем Guid Id
    Task UpdateAsync(CustomCategory task);
    Task DeleteAsync(CustomCategory task);
}
