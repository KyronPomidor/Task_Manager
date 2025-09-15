namespace Task_Manager_Back.Domain.Entities.Categories;
/// Represents the Inbox category, a hardcoded category for tasks.
public class TaskInbox : TaskCategory
{
    public TaskInbox(Guid userId) : base(userId, "Inbox", "Add here any task or idea you have in mind")
    {

    }
    private TaskInbox() { }
    public static TaskInbox LoadFromPersistence(Guid id, Guid userId, string title, string? description)
    {
        return new TaskInbox
        {
            Id = id,
            UserId = userId,
            Title = title,
            Description = description
        };
    }
    public override void Rename(string title)
    {
        throw new InvalidOperationException("Inbox cannot be renamed");
    }
}
