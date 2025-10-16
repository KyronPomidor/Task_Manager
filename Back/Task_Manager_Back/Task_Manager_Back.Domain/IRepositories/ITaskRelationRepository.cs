using System;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Domain.IRepositories;

public interface ITaskRelationRepository
{
    public Task<TaskRelation?> GetByIdAsync(Guid id);
}
