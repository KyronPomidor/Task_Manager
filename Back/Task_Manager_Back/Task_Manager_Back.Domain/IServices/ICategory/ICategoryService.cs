using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskEntity;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IServices.ICategory;
public interface ICategoryService
{
    void MoveTaskToCategory(TaskEntity task, TaskCategory targetCategory);
    bool IsSubCategory(TaskCategory parent, TaskCategory child);
}
