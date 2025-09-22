using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseTaskCategory
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
}
