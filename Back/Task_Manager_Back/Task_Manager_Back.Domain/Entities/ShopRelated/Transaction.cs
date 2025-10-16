using System.Transactions;

namespace Task_Manager_Back.Domain.Entities.ShopRelated;
//TODO: add TotalAmount property, which can be calculated from the items in the transaction
//TODO: manage what if private what is public and what is internal / protected
public class Transaction
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; } // to know which user this transaction belongs to
    public List<Guid> ShoppItemIds { get; private set; } = new(); // which items were involved in this transaction

    //public Guid? DiscountId { get; private set; } // nullable, as not all transactions will have a discount
    // no, Transaction doesn't know about Discount. Discount knows about Transaction.

    public Guid LocationId { get; private set; } // where the transaction took place
    public string? Comment { get; private set; } // optional comment about the transaction
    public DateTime DateTime { get; private set; }// when the transaction took place

    public Transaction(Guid userId, List<Guid> shoppItemIds, Guid locationId, string comment = "")
    {
        Id = Guid.NewGuid();
        UserId = userId;
        ShoppItemIds = shoppItemIds ?? throw new ArgumentNullException(nameof(shoppItemIds));
        LocationId = locationId;
        Comment = comment;
        DateTime = DateTime.UtcNow;
    }

    public void AddComment(string comment)
    {
        Comment = comment;
    }
    public void ChangeLocation(Guid locationId)
    {
        LocationId = locationId;
    }

    public void AddItem(Guid itemId)
    {
        if (!ShoppItemIds.Contains(itemId))
        {
            ShoppItemIds.Add(itemId);
        }
    }

    public void RemoveItem(Guid itemId)
    {
        if (ShoppItemIds.Contains(itemId))
        {
            ShoppItemIds.Remove(itemId);
        }
    }

    public void ClearItems()
    {
        ShoppItemIds.Clear();
    }

    public static Transaction LoadFromPersistence(Guid id, Guid userId, List<Guid> shoppItemIds, Guid locationId, DateTime dateTime, string comment = "")
    {
        var transaction = new Transaction(userId, shoppItemIds, locationId, comment);
        transaction.Id = id;
        transaction.DateTime = dateTime;
        return transaction;
    }
}