namespace Task_Manager_Back.Domain.Entities.ShopRelated
{
    public class TransactionCategory
    {
        public Guid Id { get; private set; }
        public string Title { get; private set; }

        public TransactionCategory(string title)
        {
            Id = Guid.NewGuid();
            Title = title ?? throw new ArgumentNullException(nameof(title));
        }
    }

}
