using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class Category
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Guid? ParentCategoryId {  get; set; }
    public Category(Guid userId, string title, string description, Guid? parentCategoryId)
    {
        Id = Guid.NewGuid();
        UserId = userId;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description;
        ParentCategoryId = parentCategoryId;
    }
}
