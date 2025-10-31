using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.TaskCategories;

public class TaskUserCategory : TaskCategory
{
    public Guid? ParentCategoryId { get; private set; }
    public string Color { get; private set; } = string.Empty;
    public int PositionOrder { get; set; }

    public TaskUserCategory(TaskUserCategoryCreateParams createParams)
        : base(createParams)
    {
        ParentCategoryId = createParams.ParentCategoryId;
        Color = ValidationHelper.ValidateHexColor(createParams.Color, nameof(createParams.Color));
        PositionOrder = 0;
    }

    private TaskUserCategory() { }

    public static TaskUserCategory LoadFromPersistence(TaskUserCategoryState state)
    {
        var category = new TaskUserCategory();
        LoadBaseFromPersistence(category, state);
        category.ParentCategoryId = state.ParentCategoryId;
        category.Color = state.Color;
        category.PositionOrder = state.Order;
        return category;
    }

    public void ChangeParent(Guid? parentCategoryId) => ParentCategoryId = parentCategoryId;

    public void ChangeColor(string color)
    {
        ValidationHelper.ValidateHexColor(color, nameof(color));
        Color = color;
    }

    public void ChangePositionOrder(int order) => PositionOrder = order;
}

public record TaskUserCategoryCreateParams(
    Guid UserId,
    string Title,
    string? Description,
    Guid? ParentCategoryId,
    string Color
) : TaskCategoryCreateParams(UserId, Title, Description);

public record TaskUserCategoryState(
    Guid Id,
    Guid UserId,
    string Title,
    string? Description,
    Guid? ParentCategoryId,
    string Color,
    int Order
) : TaskCategoryState(Id, UserId, Title, Description);