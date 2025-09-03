using System.Transactions;

namespace Task_Manager_Back.Domain.Aggregates.ShoppingAggregate
{
    public class Transaction
    {
        public Guid Id { get; private set; }
        public Guid UserId { get; private set; }
        public string Product { get; private set; }
        public decimal Amount { get; private set; }
        public decimal Price { get; private set; }
        public decimal Total { get; private set; }
        public bool IsIncome { get; private set; }
        public Guid CategoryId { get; private set; }
        public Guid? DiscountId { get; private set; }
        public Guid LocationId { get; private set; }
        public string Comment { get; private set; }
        public DateTime DateTime { get; private set; }

        public Transaction(Guid id, Guid userId, string product, decimal amount, decimal price, bool isIncome,
                           Guid categoryId, Guid locationId, string comment, DateTime dateTime)
        {
            Id = id;
            UserId = userId;
            Product = product ?? throw new ArgumentNullException(nameof(product));
            Amount = amount;
            Price = price;
            Total = amount * price;
            IsIncome = isIncome;
            CategoryId = categoryId;
            LocationId = locationId;
            Comment = comment;
            DateTime = dateTime;
        }

        public void ApplyDiscount(Discount discount)
        {
            DiscountId = discount.Id;
            Total = Amount * Price - discount.Amount;
        }

        public void ChangeCategory(TransactionCategory category)
        {
            CategoryId = category.Id;
        }

        public void UpdateAmount(decimal newAmount)
        {
            Amount = newAmount;
            Total = newAmount * Price;
        }
    }
}