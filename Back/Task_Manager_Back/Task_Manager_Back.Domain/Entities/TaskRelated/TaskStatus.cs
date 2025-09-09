using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskStatus
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; private set; } = string.Empty;

    public TaskStatus(TaskStatusCreateParams @params)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params));
        Title = ValidationHelper.ValidateStringField(@params.Title, 1, 30, nameof(@params), "Status title");
    }

    private TaskStatus() { }
    public static TaskStatus LoadFromPersistence(TaskStatusState state)
    {
        return new TaskStatus
        {
            Id = state.Id,
            UserId = state.UserId,
            Title = state.Title
        };
    }

    public void Rename(string title) => Title = ValidationHelper.ValidateStringField(title, 1, 30, nameof(title), "Status title");
}

public record TaskStatusCreateParams(Guid UserId, string Title);
public record TaskStatusState(Guid Id, Guid UserId, string Title);
