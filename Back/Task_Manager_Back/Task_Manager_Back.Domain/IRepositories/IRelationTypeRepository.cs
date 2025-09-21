using System;
using System.ComponentModel;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IRepositories;

public interface IRelationTypeRepository
{
    TaskEntity? GetById(Guid id);
    void Add(TaskRelation taskCustomRelation);
}
