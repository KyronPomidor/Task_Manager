using System;
using Task_Manager_Back.Domain.Entities.TaskEntity;

namespace Task_Manager_Back.Domain.IRepositories;

public interface ITaskRepository
{
    TaskEntity.TaskEntity? GetById(Guid id);
}
