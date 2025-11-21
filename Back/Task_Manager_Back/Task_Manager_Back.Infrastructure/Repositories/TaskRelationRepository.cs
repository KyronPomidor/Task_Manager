using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Infrastructure.Repositories;
public class TaskRelationRepository : ITaskRelationRepository
{
    public Task CreateAsync(TaskRelation entity)
    {
        throw new NotImplementedException();
    }

    public Task DeleteAsync(TaskRelation entity)
    {
        throw new NotImplementedException();
    }

    public Task DeleteByIdAsync(Guid entityId)
    {
        throw new NotImplementedException();
    }

    public Task<List<TaskRelation>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<TaskRelation> GetByIdAsync(Guid entityId)
    {
        throw new NotImplementedException();
    }

    public Task UpdateAsync(TaskRelation entity)
    {
        throw new NotImplementedException();
    }
}