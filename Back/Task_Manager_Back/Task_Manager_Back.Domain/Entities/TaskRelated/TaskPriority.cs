using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskPriority
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; private set; } = string.Empty;

    public TaskPriority(TaskPriorityCreateParams @params)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params));
        Title = ValidationHelper.ValidateStringField(@params.Title, 1, 30, nameof(@params), "Priority title");
    }

    private TaskPriority() { }
    public static TaskPriority LoadFromPersistence(TaskPriorityState state)
    {
        return new TaskPriority
        {
            Id = state.Id,
            UserId = state.UserId,
            Title = state.Title
        };
    }

    public void Rename(string title) => Title = ValidationHelper.ValidateStringField(title, 1, 30, nameof(title), "Priority title");
}

public record TaskPriorityCreateParams(Guid UserId, string Title);
public record TaskPriorityState(Guid Id, Guid UserId, string Title);
