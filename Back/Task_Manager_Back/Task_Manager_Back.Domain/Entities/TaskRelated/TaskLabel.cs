using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskRelated;

public class TaskLabel
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    public TaskLabel(TaskLabelCreateParams @params)
    {
        Id = Guid.NewGuid();
        UserId = ValidationHelper.ValidateGuid(@params.UserId, nameof(@params));
        Title = ValidationHelper.ValidateStringField(@params.Title, 1, 100, nameof(@params), "Label title");
        Description = @params.Description ?? string.Empty;
    }

    private TaskLabel() { }
    public static TaskLabel LoadFromPersistence(TaskLabelState state)
    {
        return new TaskLabel
        {
            Id = state.Id,
            UserId = state.UserId,
            Title = state.Title,
            Description = state.Description ?? string.Empty
        };
    }

    public void Rename(string title) => Title = ValidationHelper.ValidateStringField(title, 1, 30, nameof(title), "Label title");
    public void UpdateDescription(string? description) => Description = description ?? string.Empty;
}

public record TaskLabelCreateParams(Guid UserId, string Title, string? Description);
public record TaskLabelState(Guid Id, Guid UserId, string Title, string? Description);
