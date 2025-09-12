using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.Categories;

public class UserCategory : Category
{
    public Guid? ParentCategoryId { get; private set; }
    public string Color { get; private set; } = string.Empty;
    public int Order { get; private set; }

    public UserCategory(UserCategoryCreateParams createParams)
        : base(createParams.UserId, createParams.Title, createParams.Description)
    {
        Title = ValidationHelper.ValidateStringField(createParams.Title, 1, 100, nameof(createParams.Title), "Category name");
        Description = createParams.Description;
        ParentCategoryId = createParams.ParentCategoryId;
        Color = ValidationHelper.ValidateHexColor(createParams.Color, nameof(createParams.Color));
        Order = 0;
    }

    private UserCategory() { }

    public static UserCategory LoadFromPersistence(UserCategoryState state)
    {
        return new UserCategory
        {
            Id = state.Id,
            UserId = state.UserId,
            Title = state.Title,
            Description = state.Description,
            ParentCategoryId = state.ParentCategoryId,
            Color = state.Color,
            Order = state.Order
        };
    }

    public void Rename(string title)
    {
        Title = ValidationHelper.ValidateStringField(title, 1, 100, nameof(title), "Category name");
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

public record UserCategoryCreateParams(
    Guid UserId,
    string Title,
    string? Description,
    Guid? ParentCategoryId,
    string Color
);

public record UserCategoryState(
    Guid Id,
    Guid UserId,
    string Title,
    string? Description,
    Guid? ParentCategoryId,
    string Color,
    int Order
);