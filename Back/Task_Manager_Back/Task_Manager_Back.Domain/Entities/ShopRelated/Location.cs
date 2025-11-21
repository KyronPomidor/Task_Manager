namespace Task_Manager_Back.Domain.Entities.ShopRelated
{
    public class Location
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }

        public Location(string name)
        {
            Id = Guid.NewGuid();
            Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}
