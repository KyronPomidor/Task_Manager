using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IServices.IExpense;

namespace Task_Manager_Back.Domain.IServices.ITask;
public interface ITaskBudgetService
{
    bool CanCompleteTask(TaskEntity task, IBudgetService budgetService);
}
