using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// exists discount for products or total cart value
// didn't considerate how to apply it yet
// every shop has its own methods
// so, don't use for now and consider like original price were lower, without discount
// Linella has its points, it's too complex for now, later could be implemented
// ignore this class for now
namespace Task_Manager_Back.Domain.Entities.ShopRelated;
public class Discount
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }

    public Guid TransactionId { get; set; } // let's consider that discount is applied to transaction, not to product directly
    public decimal Amount { get; private set; }

    public Discount(string name, decimal amount, Guid transactionId)
    {
        Id = Guid.NewGuid();
        Name = name ?? throw new ArgumentNullException(nameof(name));
        TransactionId = transactionId;
        Amount = amount;
    }

    // implement this method on all entities that are saved in the database
    public static Discount LoadFromPersistence(Guid id, string name, decimal amount, Guid transactionId)
    {
        return new Discount(name, amount, transactionId)
        {
            Id = id
        };
    }
}
