using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Application.IRepositories;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.IServices.ITask;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
public class RemoveTaskRelationUseCase
{
    private readonly ITaskRelationRepository _taskRelationRepository;
    private readonly ITaskGraphService _taskGraphService;
    public RemoveTaskRelationUseCase(ITaskRelationRepository taskRelationRepository, ITaskGraphService taskGraphService)
    {
        _taskRelationRepository = taskRelationRepository;
        _taskGraphService = taskGraphService;
    }
    public async Task ExecuteAsync(Guid fromTaskId, Guid ToTaskId)
    {
        TaskEntity fromTask = await _taskRepository.GetByIdAsync(fromTaskId) ?? throw new KeyNotFoundException($"Task with Id '{fromTaskId}' not found.");
        TaskEntity ToTask = await _taskRepository.GetByIdAsync(ToTaskId) ?? throw new KeyNotFoundException($"Task with Id '{ToTaskId}' not found.");
        var taskRelation = _taskGraphService.UnlinkTasks(fromTask, ToTask);
        await _taskRelationRepository.Delete(taskRelation);
    }
}
