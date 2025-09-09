using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskRelation
{
    public Guid FromTaskId { get; private set; }
    public Guid ToTaskId { get; private set; }

    public TaskRelation(TaskRelationCreateParams @params)
    {
        FromTaskId = ValidationHelper.ValidateGuid(@params.FromTaskId, nameof(@params));
        ToTaskId = ValidationHelper.ValidateGuid(@params.ToTaskId, nameof(@params));
    }

    private TaskRelation() { }
    public static TaskRelation LoadFromPersistence(TaskRelationState state)
    {
        return new TaskRelation
        {
            FromTaskId = state.FromTaskId,
            ToTaskId = state.ToTaskId
        };
    }
}

public record TaskRelationCreateParams(Guid FromTaskId, Guid ToTaskId);
public record TaskRelationState(Guid FromTaskId, Guid ToTaskId);
