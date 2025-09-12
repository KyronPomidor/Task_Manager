namespace Task_Manager_Back.Domain.Entities.Categories;
/// Represents the Inbox category, a hardcoded category for tasks.
public class Inbox : Category
{
    public Inbox(Guid userId) : base(userId, "Inbox", "Default category for new tasks")
    {

    }
    private Inbox() { }
    public static Inbox LoadFromPersistence(Guid id, Guid userId, string title, string? description)
    {
        return new Inbox
        {
            Id = id,
            UserId = userId,
            Title = title,
            Description = description
        };
    }
}
