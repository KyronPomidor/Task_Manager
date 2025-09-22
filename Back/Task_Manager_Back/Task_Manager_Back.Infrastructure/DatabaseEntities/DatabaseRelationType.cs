using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseRelationType
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    
    // Color храним как строку HEX, т.к. EF Core не умеет напрямую хранить System.Drawing.Color
    public string Color { get; set; } = "#808080"; // Gray по умолчанию

    // Навигационное свойство: какие CustomRelations используют этот тип
    public ICollection<DatabaseTaskCustomRelation> CustomRelations { get; set; } = new List<DatabaseTaskCustomRelation>();
}
