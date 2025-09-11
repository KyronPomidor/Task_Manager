using System;
using System.Collections.Generic;

namespace Task_Manager_Back.Domain.Aggregates.ShopAggregate
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
