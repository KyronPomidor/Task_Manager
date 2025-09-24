using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Entities.TaskRelated;


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
        var task = new TaskEntity(new TaskEntityCreateParams(
            UserId: request.UserId,
            Title: request.Title,
            Description: request.Description,
            Color: request.Color,
            StatusId: request.StatusId,
            Priority: request.Priority,
            CategoryId: request.CategoryId,
            Deadline: request.Deadline
        ));


        await _taskRepository.CreateAsync(task);
    }
}