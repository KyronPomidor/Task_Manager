using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.ShoppingAggregate
{
    public class Location
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }

        public Location(Guid id, string name)
        {
            Id = id;
            Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }
}
