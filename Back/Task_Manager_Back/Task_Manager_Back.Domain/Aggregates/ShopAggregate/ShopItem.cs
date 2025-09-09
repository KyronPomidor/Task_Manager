namespace Task_Manager_Back.Domain.Aggregates.ShopAggregate;
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
        Name = string.IsNullOrEmpty(name) || name.Length > 100 ? throw new ArgumentException("Name must be 1-100 chars", nameof(name)) : name;
        Amount = amount <= 0 ? throw new ArgumentException("Amount must be positive", nameof(amount)) : amount;
        Price = price < 0 ? throw new ArgumentException("Price cannot be negative", nameof(price)) : price;
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
        Name = string.IsNullOrEmpty(name) || name.Length > 100
            ? throw new ArgumentException("Name must be 1-100 chars", nameof(name)) : name;
    }

    public void UpdateAmount(double amount)
    {
        Amount = amount <= 0 ? throw new ArgumentException("Amount must be positive", nameof(amount)) : amount;
    }

    public void UpdatePrice(double? price)
    {
        Price = price < 0 ? throw new ArgumentException("Price cannot be negative", nameof(price)) : price;
    }

    public void UpdateProductCategory(Guid? productCategoryId)
    {
        ProductCategoryId = productCategoryId;
    }
}