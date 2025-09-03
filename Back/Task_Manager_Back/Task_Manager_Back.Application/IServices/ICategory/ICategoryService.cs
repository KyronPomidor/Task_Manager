using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.IServices.ICategory;
public interface ICategoryService
{
    void MoveTaskToCategory(Domain.Aggregates.TaskAggregate.Task task, Category targetCategory);
    bool IsSubCategory(Category parent, Category child);
}
