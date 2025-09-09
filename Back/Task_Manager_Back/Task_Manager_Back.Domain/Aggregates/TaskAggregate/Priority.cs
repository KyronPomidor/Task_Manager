namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;
public class Priority
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; private set; }

    public Priority(Guid userId, string title)
    {
        Id = Guid.NewGuid();
        UserId = userId == Guid.Empty ? throw new ArgumentException("UserId required", nameof(userId)) : userId;
        Title = string.IsNullOrEmpty(title) || title.Length > 30 ? throw new ArgumentException("Title must be 1-30 chars", nameof(title)) : title;
    }
    private Priority() { }
    public static Priority LoadFromPersistence(Guid id, Guid userId, string title)
    {
        return new Priority
        {
            Id = id,
            UserId = userId,
            Title = title
        };
    }

    public void Rename(string title)
    {
        Title = string.IsNullOrEmpty(title) || title.Length > 30
            ? throw new ArgumentException("Title must be 1-30 chars", nameof(title)) : title;
    }
}