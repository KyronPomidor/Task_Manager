using System.Transactions;

namespace Task_Manager_Back.Domain.Aggregates.ShoppingAggregate
{
    public class ShoppingItem
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public decimal Amount { get; private set; }
        public decimal Price { get; private set; }
        public bool IsInCart { get; private set; }
        public bool IsBought { get; private set; }
        public List<Transaction> Transactions { get; private set; } = new();

        public ShoppingItem(Guid id, string name, decimal amount, decimal price, bool isInCart, bool isBought)
        {
            Id = id;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Amount = amount;
            Price = price;
            IsInCart = isInCart;
            IsBought = isBought;
        }

        public Transaction ConvertToTransaction(Guid userId, Location location, TransactionCategory category)
        {
            return new Transaction(
                Guid.NewGuid(),
                userId,
                Name,
                Amount,
                Price,
                false,
                category.Id,
                location.Id,
                string.Empty,
                DateTime.UtcNow
            );
        }
    }
}