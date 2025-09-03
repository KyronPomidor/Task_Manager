using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Task_Manager_Back.Application.IServices.IExpense;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.IServices.ITask;
public interface ITaskBudgetService
{
    bool CanCompleteTask(Domain.Aggregates.TaskAggregate.Task task, IBudgetService budgetService);
}
