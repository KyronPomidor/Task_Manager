using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class GetTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public GetTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    //TODO: use GetTaskRequest
    public async Task<TaskEntity> ExecuteAsync(Guid taskIdd)
    {
        return await _taskRepository.GetByIdAsync(taskIdd);
    }
}
