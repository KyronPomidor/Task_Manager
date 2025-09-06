using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class CreateTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public CreateTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }
    public async Task ExecuteAsync
        (
        Guid userId,
        string title,
        string description,
        Guid statusId,
        Guid categoryId,
        DateTime deadline
        )
    {
        TaskEntity task = new TaskEntity
        (
        userId,
        title,
        description,
        statusId,
        categoryId,
        deadline
        );
        await _taskRepository.CreateAsync(task);
    }
}
