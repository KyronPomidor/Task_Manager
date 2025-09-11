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
            request.UserId,
            request.Title,
            request.Description,
            request.StatusId,
            request.PriorityId,
            request.CategoryId,
            request.Deadline
        ));

        await _taskRepository.CreateAsync(task);
    }
}