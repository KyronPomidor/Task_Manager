using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.IServices.IExpense;

namespace Task_Manager_Back.Domain.IServices.ITask;
public interface ITaskBudgetService
{
    bool CanCompleteTask(TaskEntity task, IBudgetService budgetService);
}
