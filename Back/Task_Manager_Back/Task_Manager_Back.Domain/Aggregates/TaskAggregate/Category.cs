using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Task_Manager_Back.Domain.Aggregates.TaskAggregate;

public class Category
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public Guid? ParentCategoryId {  get; set; }
    public Category(Guid id, Guid userId, string title, string description, Guid? parentCategoryId)
    {
        Id = id;
        UserId = userId;
        Title = title ?? throw new ArgumentNullException(nameof(title));
        Description = description;
        ParentCategoryId = parentCategoryId;
    }
}
