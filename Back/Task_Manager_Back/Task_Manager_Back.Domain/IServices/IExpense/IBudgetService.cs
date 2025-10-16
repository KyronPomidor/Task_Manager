using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Entities.ShopRelated;

namespace Task_Manager_Back.Domain.IServices.IExpense;
public interface IBudgetService
{
    bool IsWithinBudget(Transaction transaction, decimal budgetLimit);
}
