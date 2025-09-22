using Task_Manager_Back.Domain.Entities.ShopRelated;

namespace Task_Manager_Back.Domain.IServices.IExpense;
public interface IBudgetService
{
    bool IsWithinBudget(Transaction transaction, decimal budgetLimit);
}
