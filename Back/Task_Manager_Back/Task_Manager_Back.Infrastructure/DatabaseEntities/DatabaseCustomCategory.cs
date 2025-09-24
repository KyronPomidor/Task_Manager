using System;

namespace Task_Manager_Back.Infrastructure.DatabaseEntities;

public class DatabaseCustomCategory
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public int Order { get; set; }
    public Guid? ParentCategoryId { get; set; }

    // Navigation properties
    public ApplicationUser User { get; set; } = null!;
    public ICollection<DatabaseTaskEntity> Tasks { get; set; } = new List<DatabaseTaskEntity>(); // tasks in this category

    // Self-referencing relationship for hierarchical categories
    public ICollection<DatabaseCustomCategory> SubCategories { get; set; } = new List<DatabaseCustomCategory>(); // child categories
    public DatabaseCustomCategory? ParentCategory { get; set; } // parent category (if any)
}
