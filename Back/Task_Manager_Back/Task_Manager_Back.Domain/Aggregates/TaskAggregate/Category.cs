namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;
public class Category
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; private set; }
    public string? Description { get; private set; }
    public Guid? ParentCategoryId { get; private set; }
    public string Color { get; private set; }
    public int Order { get; private set; }

    public Category(Guid userId, string title, string? description, Guid? parentCategoryId, string color)
    {
        Id = Guid.NewGuid();
        UserId = userId == Guid.Empty ? throw new ArgumentException("UserId required", nameof(userId)) : userId;
        Title = string.IsNullOrEmpty(title) || title.Length > 100 ? throw new ArgumentException("Title must be 1-100 chars", nameof(title)) : title;
        Description = description;
        ParentCategoryId = parentCategoryId;
        Color = string.IsNullOrEmpty(color) || !System.Text.RegularExpressions.Regex.IsMatch(color, @"^#[0-9A-Fa-f]{6}$")
            ? throw new ArgumentException("Color must be a valid hex code (#RRGGBB)", nameof(color)) : color;
        Order = 0;
    }

    private Category() { }

    public static Category LoadFromPersistence(Guid id, Guid userId, string title, string? description, Guid? parentCategoryId, string color, int order)
    {
        return new Category
        {
            Id = id,
            UserId = userId,
            Title = title,
            Description = description,
            ParentCategoryId = parentCategoryId,
            Color = color,
            Order = order
        };
    }

    public void Rename(string title)
    {
        Title = string.IsNullOrEmpty(title) || title.Length > 100
            ? throw new ArgumentException("Title must be 1-100 chars", nameof(title)) : title;
    }

    public void UpdateDescription(string? description)
    {
        Description = description;
    }

    public void ChangeParent(Guid? parentCategoryId)
    {
        ParentCategoryId = parentCategoryId;
    }

    public void ChangeColor(string color)
    {
        Color = string.IsNullOrEmpty(color) || !System.Text.RegularExpressions.Regex.IsMatch(color, @"^#[0-9A-Fa-f]{6}$")
            ? throw new ArgumentException("Color must be a valid hex code (#RRGGBB)", nameof(color)) : color;
    }

    public void UpdateOrder(int order)
    {
        Order = order;
    }
}