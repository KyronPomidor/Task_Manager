using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Task_Manager_Back.Application.IServices.IExpense;
public interface ITransactionValidationService
{
    void Validate(Transaction transaction);
}
