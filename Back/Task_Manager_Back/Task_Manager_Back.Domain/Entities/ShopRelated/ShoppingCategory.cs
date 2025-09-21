using System;
using System.Collections.Generic;

namespace Task_Manager_Back.Domain.Entities.ShopRelated;

public class ShoppingCategory
{
    public Guid Id { get; private set; }
    public string Title { get; private set; }

    public ShoppingCategory(string title)
    {
        Id = Guid.NewGuid();
        Title = title ?? throw new ArgumentNullException(nameof(title));
    }
    
    public static ShoppingCategory LoadFromPersistence(Guid id, string title)
    {
        var category = new ShoppingCategory(title);
        category.Id = id;
        return category;
    }
}

