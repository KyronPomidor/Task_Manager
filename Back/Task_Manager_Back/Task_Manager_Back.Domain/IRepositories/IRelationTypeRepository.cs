using System;
using System.ComponentModel;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Domain.IRepositories;

public interface IRelationTypeRepository
{
    TaskEntity.TaskEntity? GetById(Guid id);
    void Add(TaskRelation taskCustomRelation);
}
