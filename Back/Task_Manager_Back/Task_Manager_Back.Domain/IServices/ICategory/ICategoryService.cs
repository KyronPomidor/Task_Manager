using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IServices.ICategory;
public interface ICategoryService
{
    void MoveTaskToCategory(TaskEntity task, Category targetCategory);
    bool IsSubCategory(Category parent, Category child);
}
