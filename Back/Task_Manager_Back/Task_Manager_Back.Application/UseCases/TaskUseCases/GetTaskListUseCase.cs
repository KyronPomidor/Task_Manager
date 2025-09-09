using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class GetTaskListUseCase
{
    private readonly ITaskRepository _taskRepository;

    public GetTaskListUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    //TODO: use GetTasksRequest
    public async Task<List<TaskEntity>> ExecuteAsync()
    {
        return await _taskRepository.GetAllAsync();
    }
}
