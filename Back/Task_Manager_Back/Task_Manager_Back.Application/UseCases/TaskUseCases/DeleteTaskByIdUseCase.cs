using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class DeleteTaskByIdUseCase
{
    private readonly ITaskRepository _taskRepository;

    public DeleteTaskByIdUseCase(ITaskRepository taskRepository)
    {
        _taskRepository = taskRepository;
    }

    public async Task ExecuteAsync(DeleteTaskByIdRequest request)
    {
        TaskEntity task = await _taskRepository.GetByIdAsync(request.TaskId)
            ?? throw new KeyNotFoundException($"Task with Id '{request.TaskId}' not found.");

        task.Delete();
        await _taskRepository.DeleteAsync(task);
    }
}
