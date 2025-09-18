using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.ShopRelated;

public class ShopItem
{
    public Guid Id { get; private set; }
    public Guid TaskId { get; private set; }  // <-- FK to TaskEntity
    public string Name { get; private set; }
    public double Amount { get; private set; }
    public double? Price { get; private set; }
    public Guid? ProductCategoryId { get; private set; }

    public ShopItem(ShopItemCreateParams @params)
    {
        Id = Guid.NewGuid();
        TaskId = ValidationHelper.ValidateGuid(@params.TaskId, nameof(@params));
        Name = ValidationHelper.ValidateStringField(@params.Name, 1, 100, nameof(@params));
        Amount = ValidationHelper.ValidateNonNegative(@params.Amount, nameof(@params));
        Price = @params.Price.HasValue ? ValidationHelper.ValidateNonNegative(@params.Price.Value, nameof(@params)) : null;
        ProductCategoryId = @params.ProductCategoryId;
    }

    private ShopItem() { }

    public static ShopItem LoadFromPersistence(Guid id, Guid taskId, string name, double amount, double? price, Guid? productCategoryId)
    {
        return new ShopItem
        {
            Id = id,
            TaskId = taskId,
            Name = name,
            Amount = amount,
            Price = price,
            ProductCategoryId = productCategoryId
        };
    }

    public void UpdateName(string name) => Name = ValidationHelper.ValidateStringField(name, 1, 100, nameof(name));
    public void UpdateAmount(double amount) => Amount = ValidationHelper.ValidateNonNegative(amount, nameof(amount));
    public void UpdatePrice(double? price) => Price = price.HasValue ? ValidationHelper.ValidateNonNegative(price.Value, nameof(price)) : null;
    public void UpdateProductCategory(Guid? productCategoryId) => ProductCategoryId = productCategoryId;
}

public record ShopItemCreateParams(Guid TaskId, string Name, double Amount, double? Price, Guid? ProductCategoryId);
