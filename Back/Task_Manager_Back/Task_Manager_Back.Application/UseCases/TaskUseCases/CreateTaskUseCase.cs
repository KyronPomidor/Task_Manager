using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class CreateTaskUseCase
{
    private readonly ITaskRepository _taskRepository;

    public CreateTaskUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task ExecuteAsync(CreateTaskRequest request)
    {
        // later use not the constructor but a factory method in the Domain service. It will handle the order position and other business logic
        var task = new TaskEntity(
            request.UserId,
            request.Title,
            request.Description,
            request.Color,
            request.PriorityId,
            request.StatusId,
            request.CategoryId,
            request.Deadline,
            request.LabelIds,
            request.OrderPosion
        );


        await _taskRepository.CreateAsync(task);
    }
}