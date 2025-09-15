using Task_Manager_Back.Domain.Entities.Categories;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IServices.ICategory;
public interface ICategoryService
{
    void MoveTaskToCategory(TaskEntity task, TaskCategory targetCategory);
    bool IsSubCategory(TaskCategory parent, TaskCategory child);
}
