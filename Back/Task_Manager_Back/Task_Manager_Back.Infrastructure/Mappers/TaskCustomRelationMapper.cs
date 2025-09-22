using System;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Infrastructure.DatabaseEntities;

namespace Task_Manager_Back.Infrastructure.Mappers;

public static class TaskCustomRelationMapper
{
    public static DatabaseTaskCustomRelation ToDbEntity(this TaskCustomRelation custom)
    {
        return new DatabaseTaskCustomRelation
        {
            FromTaskId = custom.FromTaskId,
            ToTaskId = custom.ToTaskId,
            RelationTypeId = custom.RelationTypeId
        };
    }

    public static TaskCustomRelation ToDomain(this DatabaseTaskCustomRelation dbCustom)
    {
        return TaskCustomRelation.LoadFromPersistence(dbCustom.FromTaskId, dbCustom.ToTaskId, dbCustom.RelationTypeId);
    }
}