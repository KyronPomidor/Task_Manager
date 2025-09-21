using System;
using Task_Manager_Back.Domain.Entities.TaskEntity;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IRepositories;

public interface ITaskRepository
{
    TaskEntity? GetById(Guid id);
}
