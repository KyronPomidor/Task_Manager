using System;

namespace Task_Manager_Back.Domain.Entities.ShopRelated;

// Like singletone. One cart per user.
// Items are in task, cart, or transaction. 
// Cart can be converted to transaction.
// Cart can be cleared (all items removed).
// 
public class Cart
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }

    public List<Guid> ShoppingItemIds { get; private set; } = new List<Guid>();

    public Cart(Guid userId, List<Guid>? shoppingItemIds = null)
    {
        Id = Guid.NewGuid();
        ShoppingItemIds = shoppingItemIds ?? new List<Guid>();
        UserId = userId;
    }

    public void AddItem(Guid shoppingItemId)
    {
        if (!ShoppingItemIds.Contains(shoppingItemId))
        {
            ShoppingItemIds.Add(shoppingItemId);
        }
    }

    public void RemoveItem(Guid shoppingItemId)
    {
        if (ShoppingItemIds.Contains(shoppingItemId))
        {
            ShoppingItemIds.Remove(shoppingItemId);
        }
    }

    public void ClearItems()
    {
        ShoppingItemIds.Clear();
    }

    public void TransferItemsToTransaction(Transaction transaction) // assumes transaction is created for the same user
                                                                    // TODO: add check that transaction.UserId == this.UserId
    // a little composition here
    {
        foreach (var itemId in ShoppingItemIds)
        {
            transaction.AddItem(itemId);
        }
        ClearItems();
    }

    public static Cart LoadFromPersistence(Guid id, Guid userId, List<Guid>? shoppingItemIds = null)
    {
        var cart = new Cart(userId, shoppingItemIds);
        cart.Id = id;
        return cart;
    }
}
