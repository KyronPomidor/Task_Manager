using System;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Infrastructure.DatabaseEntities;

namespace Task_Manager_Back.Infrastructure.Mappers;

public static class TaskDependencyRelationMapper
{
    public static DatabaseTaskDependencyRelation ToDbEntity(this TaskDependencyRelation dep)
    {
        return new DatabaseTaskDependencyRelation
        {
            FromTaskId = dep.FromTaskId,
            ToTaskId = dep.ToTaskId
        };
    }

    public static TaskDependencyRelation ToDomain(this DatabaseTaskDependencyRelation dbDep)
    {
        return TaskDependencyRelation.LoadFromPersistence(dbDep.FromTaskId, dbDep.ToTaskId);
    }
}