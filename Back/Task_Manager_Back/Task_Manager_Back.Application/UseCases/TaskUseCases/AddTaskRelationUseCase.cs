using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Application.Requests.TaskRequests;
using Task_Manager_Back.Domain.IServices.ITask;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class AddTaskRelationUseCase
{
    private readonly ITaskEntityRepository _taskRepository;
    private readonly ITaskRelationRepository _taskRelationRepository;
    private readonly ITaskGraphService _taskGraphService;

    public AddTaskRelationUseCase(
        ITaskRelationRepository taskRelationRepository,
        ITaskGraphService taskGraphService,
        ITaskEntityRepository taskRepository)
    {
        _taskRelationRepository = taskRelationRepository;
        _taskGraphService = taskGraphService;
        _taskRepository = taskRepository;
    }

    public async Task ExecuteAsync(AddTaskRelationRequest request)
    {
        var fromTask = await _taskRepository.GetByIdAsync(request.FromTaskId)
                       ?? throw new KeyNotFoundException($"Task with Id '{request.FromTaskId}' not found.");

        var toTask = await _taskRepository.GetByIdAsync(request.ToTaskId)
                     ?? throw new KeyNotFoundException($"Task with Id '{request.ToTaskId}' not found.");

        var taskRelation = _taskGraphService.LinkTasks(fromTask, toTask);
        await _taskRelationRepository.CreateAsync(taskRelation);
    }
}
