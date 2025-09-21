using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public abstract class TaskRelation
{
    public Guid FromTaskId { get; private set; } // do not need this, as chatGPT said, but for simplicity of querying, will keep it
                                                 // in a real-world scenario, it is better to have a separate table for relations
                                                 // and have a composite key of FromTaskId and ToTaskId
                                                 // as well as an index on ToTaskId for reverse lookups
                                                 // but for now, will keep it simple
                                                 // and optimize later if needed
                                                 // also, in a real-world scenario, would use a proper graph database or at least a graph library
                                                 // to manage relations, but for now, will keep it simple
                                                 // hehe, idk what to do here, will think about it later
                                                 // also, would need to think about cascading deletes and updates
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle circular dependencies
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle different types of relations
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation metadata
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation versioning
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation auditing
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation permissions
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation notifications
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation reporting
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation analytics
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation visualization
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation import/export
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation search
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation filtering
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation sorting
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation grouping
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation pagination
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation caching
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation performance
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation scalability
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation reliability
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation maintainability
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation extensibility
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation usability
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation accessibility
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation internationalization
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation localization
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation documentation
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation testing
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation deployment
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation monitoring
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation logging
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation debugging
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation support
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation training
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation feedback
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation improvement
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation innovation
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation future-proofing
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation legacy support
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation backward compatibility
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation forward compatibility
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation deprecation
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation migration
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation integration
                                                 // but for now, will keep it simple
                                                 // also, would need to think about how to handle relation collaboration

    public Guid ToTaskId { get; private set; }
    public TaskRelation(Guid fromTaskId, Guid toTaskId)
    {
        FromTaskId = fromTaskId;
        ToTaskId = toTaskId;
    }
    

}

public class TaskDependencyRelation : TaskRelation
{
    //cannot complete 'From' until 'To' is done)
    public TaskDependencyRelation(Guid fromTaskId, Guid toTaskId)
        : base(fromTaskId, toTaskId)
    {
    }

    public static TaskDependencyRelation LoadFromPersistence(Guid fromTaskId, Guid toTaskId)
    {
        return new TaskDependencyRelation(fromTaskId, toTaskId); // id? No id, composite key.. may be.
    }
}

public class TaskCustomRelation : TaskRelation
{
    public Guid RelationTypeId { get; private set; }
    public TaskCustomRelation(Guid fromTaskId, Guid toTaskId, Guid relationTypeId)
        : base(fromTaskId, toTaskId)
    {
        RelationTypeId = relationTypeId;
    }

    public static TaskCustomRelation LoadFromPersistence(Guid fromTaskId, Guid toTaskId, Guid relationTypeId)
    {
        return new TaskCustomRelation(fromTaskId, toTaskId, relationTypeId); // id? No id, composite key.. may be. again.
    }
}

public class RelationType
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; }
    public string? Description { get; private set; }
    public Color Color { get; private set; } // just for fun, good to add to another entities
    public RelationType(string name, string? description, Color? color)
    {
        Id = Guid.NewGuid();
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Description = description;
        Color = color ?? Color.Gray;
    }

    // color should be handled normally, it is TODO: for future.

    public static RelationType LoadFromPersistence(Guid id, Guid userId, string name, string? description, Color color)
    {
        var relationType = new RelationType(name, description, color);
        relationType.Id = id;
        return relationType;
    }
    
}