using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.Categories;

public class UserCategory : Category
{
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public Guid? ParentCategoryId { get; private set; }
    public string Color { get; private set; } = string.Empty;
    public int Order { get; private set; }

    public UserCategory(Guid userId, string title, string? description, Guid? parentCategoryId, string color) : base(userId)
    {
        Title = ValidationHelper.ValidateStringField(title, 1, 100, nameof(title), "Category name");
        Description = description;
        ParentCategoryId = parentCategoryId;
        Color = ValidationHelper.ValidateHexColor(color, nameof(color));
        Order = 0;
    }

    private UserCategory() { }

    public static UserCategory LoadFromPersistence(Guid id, Guid userId, string title, string? description, Guid? parentCategoryId, string color, int order)
    {
        return new UserCategory
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
        Title = ValidationHelper.ValidateStringField(title, 1, 100, "Category name");
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
        ValidationHelper.ValidateHexColor(color, nameof(color));
        Color = color;
    }

    public void UpdateOrder(int order)
    {
        Order = order;
    }
}