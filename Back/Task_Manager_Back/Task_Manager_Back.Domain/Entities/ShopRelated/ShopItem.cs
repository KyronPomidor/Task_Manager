using Task_Manager_Back.Domain.Common;

namespace Task_Manager_Back.Domain.Entities.ShopRelated;

public class ShopItem
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public double Amount { get; private set; }
    public double? Price { get; private set; }
    public Guid? ProductCategoryId { get; private set; }

    public ShopItem(string name, double amount, double? price, Guid? productCategoryId)
    {
        Id = Guid.NewGuid();
        Name = ValidationHelper.ValidateStringField(name, 1, 100, nameof(name));
        Amount = ValidationHelper.ValidateNonNegative(amount, nameof(amount));
        Price = price.HasValue ? ValidationHelper.ValidateNonNegative(price.Value, nameof(price)) : null;
        ProductCategoryId = productCategoryId;
    }

    private ShopItem() { }

    public static ShopItem LoadFromPersistence(Guid id, string name, double amount, double? price, Guid? productCategoryId)
    {
        return new ShopItem
        {
            Id = id,
            Name = name,
            Amount = amount,
            Price = price,
            ProductCategoryId = productCategoryId
        };
    }

    public void UpdateName(string name)
    {
        Name = ValidationHelper.ValidateStringField(name, 1, 100, nameof(name));
    }

    public void UpdateAmount(double amount)
    {
        Amount = ValidationHelper.ValidateNonNegative(amount, nameof(amount));
    }

    public void UpdatePrice(double? price)
    {
        Price = price.HasValue ? ValidationHelper.ValidateNonNegative(price.Value, nameof(price)) : null;
    }

    public void UpdateProductCategory(Guid? productCategoryId)
    {
        ProductCategoryId = productCategoryId;
    }
}
