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

    public async Task<Guid> ExecuteAsync(CreateTaskRequest request)
    {
        // later use not the constructor but a factory method in the Domain service. It will handle the order position and other business logic
        // To create Task, the category shoyld exist. But I don't check it here, because the repository will throw exception if category not found
        //TO CHECK: do I passed all params needed?
        var createParams = new TaskEntityCreateParams(
            userId: request.UserId,
            title: request.Title,
            description: request.Description,
            color: request.Color, //TODO: validate in domain service, do it optional, generate random color if not provided
            priorityId: request.PriorityId,
            priorityLevel: request.PriorityLevel, // TEMP FIELD
            statusId: request.StatusId,
            categoryId: request.CategoryId, // Null means Inbox category
            deadline: request.Deadline,
            labels: request.LabelIds,
            order: request.OrderPosition
        );

        var task = new TaskEntity(createParams);


        await _taskRepository.CreateAsync(task);

        return task.Id;
    }
}