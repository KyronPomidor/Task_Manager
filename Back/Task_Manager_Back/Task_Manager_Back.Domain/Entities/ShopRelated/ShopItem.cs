using System.Transactions;

namespace Task_Manager_Back.Domain.Entities.ShopRelated;

// Okay, this looks messy. An item can be in cart, or bought (in transaction), or linked to task (to buy later).
// Life flow: created -> (linked to task) -> (moved to cart) -> (bought, linked to transaction)
// If it is in cart, it is not linked to task (as it is in cart now).
// If it is bought, it is linked to transaction (and not in cart, not linked to task).
public class ShopItem
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public decimal Amount { get; private set; }
    public decimal Price { get; private set; }
    public string? Description { get; private set; } // optional comment
    public bool IsInCart { get; private set; }
    public bool IsBought { get; private set; } // may be useful, but.. if it is in cart, it is not bought
                                               // and if it is bought, it is in transaction
    public Guid? TransactionId { get; private set; } // if bought, link to transaction, new created transaction
    public Guid? TaskId { get; private set; } // if linked to task, link to task
                                              // userId is not needed, as it is in transaction or task or Cart, which have userId
    public Guid? ShoppingCategoryId { get; private set; } // if linked to category, link to category
    public ShopItem(string name, decimal amount, decimal price, bool isInCart, bool isBought, Guid? shoppingCategoryId = null, Guid? taskId = null, Guid? transactionId = null, string? description = null)
    {
        Id = Guid.NewGuid();
        Name = name ?? throw new ArgumentNullException(nameof(name));
        Amount = amount;
        Price = price;
        Description = description; // optional
        IsInCart = isInCart; // false by default
        IsBought = isBought; // false by default
        ShoppingCategoryId = shoppingCategoryId;
        TaskId = taskId;
        TransactionId = transactionId;
    }

    public void AddToCart()
    {
        if (IsBought)
            throw new InvalidOperationException("Cannot add a bought item to the cart.");
        IsInCart = true;
        TaskId = null; // Remove link to task when added to cart, for Garbage Collector as I understand
    }

    public static ShopItem LoadFromPersistence(Guid id, string name, decimal amount, decimal price, bool isInCart, bool isBought, Guid? shoppingCategoryId = null, Guid? taskId = null, Guid? transactionId = null)
    {
        var item = new ShopItem(name, amount, price, isInCart, isBought, shoppingCategoryId, taskId, transactionId);
        item.Id = id;
        return item;
    }
}