using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Task_Manager_Back.Domain.IServices.IExpense;
public interface ITransactionValidationService
{
    void Validate(Transaction transaction); // what is this for and how it arrived here???
}
