using System;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IRepositories;

public interface ITaskRepository
{
    Task<List<TaskEntity?>> GetAllAsync(Guid userId); // get all tasks for a user, version for all users is a little dangerous and meaningless
    Task<TaskEntity?> GetByIdAsync(Guid id);
    Task CreateAsync(TaskEntity task);
    Task UpdateAsync(TaskEntity task);
    Task DeleteAsync(TaskEntity task);
}
