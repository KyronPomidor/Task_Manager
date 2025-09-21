using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Entities.TaskEntity;

public abstract class TaskCategory
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; private set; }
    public string? Description { get; private set; }


    public TaskCategory(Guid userId, string title, string? description)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description;
    }

    public void Rename(string newTitle)
    {
        if (string.IsNullOrWhiteSpace(newTitle))
            throw new ArgumentNullException(nameof(newTitle));
        Title = newTitle;
    }

    public void UpdateDescription(string? description)
    {
        Description = description;
    }

}

public class InboxCategory : TaskCategory
{
    public InboxCategory(Guid userId)
        : base(userId, "Inbox", "Default category for uncategorized tasks")
    {
    }
}
public class CustomCategory : TaskCategory
{
    // For UI ordering among siblings
    public int Order { get; private set; }
    public Guid? ParentCategoryId { get; private set; }

    internal CustomCategory(Guid userId, string title, string? description, Guid? parentCategoryId, int order = 0)
        : base(userId, title, description)
    {
        ParentCategoryId = parentCategoryId; // can be null for top-level categories, but must reference an existing category if not null
                                             // Validation to be handled in service layer
                                             // No need to check for circular references here, caategory just created have not children yet, so no risk of circular reference

        Order = order;   
    }

    internal void SetOrder(int order)
    {
        Order = order;
    }

    internal void SetParent(Guid? parentCategoryId)
    {
        ParentCategoryId = parentCategoryId;
    }
    
    
}