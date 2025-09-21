using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Entities.ShopRelated;
public class Location
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Name { get; private set; }

    public Location(string name, Guid userId)
    {
        Id = Guid.NewGuid();
        Name = name ?? throw new ArgumentNullException(nameof(name));
        UserId = userId;
    }
    
    public static Location LoadFromPersistence(Guid id, string name, Guid userId)
    {
        var location = new Location(name, userId);
        location.Id = id;
        return location;
    }
    
}
