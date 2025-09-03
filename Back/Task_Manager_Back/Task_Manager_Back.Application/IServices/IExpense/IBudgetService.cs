using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.ShoppingAggregate;

namespace Task_Manager_Back.Application.IServices.IExpense;
public interface IBudgetService
{
    bool IsWithinBudget(Transaction transaction, Decimal budgetLimit);
}
