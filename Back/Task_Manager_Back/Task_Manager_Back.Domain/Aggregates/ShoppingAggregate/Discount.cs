using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.ShoppingAggregate
{
    public class Discount
    {
        public Guid Id { get; set; }
        public string Name { get; private set; }
        public decimal Amount { get; private set; }

        public Discount(string name, decimal amount)
        {
            Id = Guid.NewGuid();
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Amount = amount;
        }
    }
}
