using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.IServices.ITask;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class RemoveTaskRelationUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly ITaskRelationRepository _taskRelationRepository;
    private readonly ITaskGraphService _taskGraphService;

    public RemoveTaskRelationUseCase(
        ITaskRepository taskRepository,
        ITaskRelationRepository taskRelationRepository,
        ITaskGraphService taskGraphService)
    {
        _taskRepository = taskRepository;
        _taskRelationRepository = taskRelationRepository;
        _taskGraphService = taskGraphService;
    }

    public async Task ExecuteAsync(RemoveTaskRelationRequest request)
    {
        var fromTask = await _taskRepository.GetByIdAsync(request.FromTaskId)
            ?? throw new KeyNotFoundException($"Task with Id '{request.FromTaskId}' not found.");

        var toTask = await _taskRepository.GetByIdAsync(request.ToTaskId)
            ?? throw new KeyNotFoundException($"Task with Id '{request.ToTaskId}' not found.");

        var taskRelation = _taskGraphService.UnlinkTasks(fromTask, toTask);

        await _taskRelationRepository.DeleteAsync(taskRelation);
    }
}
