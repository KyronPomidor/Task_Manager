using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.ShopAggregate;

namespace Task_Manager_Back.Domain.IServices.IExpense;
public interface IBudgetService
{
    bool IsWithinBudget(Transaction transaction, decimal budgetLimit);
}
