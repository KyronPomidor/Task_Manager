namespace Task_Manager_Back.Domain.Entities.ShopRelated
{
    public class Discount
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public decimal Amount { get; private set; }

        public Discount(string name, decimal amount)
        {
            Id = Guid.NewGuid();
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Amount = amount;
        }

        // implement this method on all entities that are saved in the database
        public static Discount LoadFromPersistence(Guid id, string name, decimal amount)
        {
            return new Discount(name, amount)
            {
                Id = id
            };
        }
    }
}
