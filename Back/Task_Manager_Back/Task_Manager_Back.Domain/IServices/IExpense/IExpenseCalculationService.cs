using Task_Manager_Back.Domain.Entities.ShopRelated;

namespace Task_Manager_Back.Domain.IServices.IExpense;
public interface IExpenseCalculationService
{
    decimal CalculateTotalByCategory(Guid userId, TransactionCategory transactionCategory, DateTime from, DateTime to);
}
