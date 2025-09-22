using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

// User can get only his own tasks, so the repository should filter by userId
public class GetTaskListUseCase
{
    private readonly ITaskRepository _taskRepository;

    public GetTaskListUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    //TODO: use GetTasksRequest
    public async Task<List<TaskEntity?>> ExecuteAsync(Guid userId)
    {
        return await _taskRepository.GetAllAsync(userId);
        // again a strange 'use case' that is just a pass through to the repository...
        // in future can filter, sort, paginate, etc.
        // but for now, it is just a pass through...
        // can transform to DTOs here if needed...
        // can validate input here if needed...

    }
}
