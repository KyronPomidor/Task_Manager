namespace Task_Manager_Back.Domain.Entities.Categories;
/// Represents the Inbox category, a hardcoded category for tasks.
public class TaskInbox : TaskCategory
{
    public TaskInbox(Guid userId)
        : base(new TaskCategoryCreateParams
            (userId, "Inbox", "Add here any task or idea you have in mind"))
    {

    }
    private TaskInbox() { }

    public static TaskInbox LoadFromPersistence(TaskCategoryState state)
    {
        var inbox = new TaskInbox();
        LoadBaseFromPersistence(inbox, state);
        return inbox;
    }

    public override void Rename(string title)
    {
        throw new InvalidOperationException("Inbox cannot be renamed");
    }
}
