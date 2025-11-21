using System.Transactions;

namespace Task_Manager_Back.Domain.IServices.IExpense;
public interface ITransactionValidationService
{
    void Validate(Transaction transaction);
}
