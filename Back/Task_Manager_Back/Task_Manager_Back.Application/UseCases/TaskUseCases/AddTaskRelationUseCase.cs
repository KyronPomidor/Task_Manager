using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Aggregates.TaskAggregate;
using Task_Manager_Back.Domain.DomainServices.TaskServices;
using Task_Manager_Back.Domain.IRepositories;
using Task_Manager_Back.Domain.IServices.ITask;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

// Use case to add a relation between two tasks
// User can add relation only between his own tasks, so the repository should filter by userId
// Use DomainService to add relation. Relation can be user defined or dependency. And user defined can be of different types (e.g. "relates to", "duplicates", etc.)
// Before adding the user defined relation, need to check if it already exists. So, user first time creates the type, and then uses it creating the relations.
public class AddTaskRelationUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly IRelationTypeRepository _relationTypeRepository;
    private readonly TaskDomainService _taskDomainService;
    public AddTaskRelationUseCase(IRelationTypeRepository taskRelationRepository, ITaskRepository taskRepository, TaskDomainService taskDomainService)
    {
        _relationTypeRepository = taskRelationRepository; // yes
        _taskRepository = taskRepository; // may be yes
        _taskDomainService = taskDomainService; // may be yes
    }
    public async Task ExecuteAsync(Guid fromTaskId, Guid ToTaskId, Guid TaskRelationId)
    {
        var fromTask = await _taskRepository.GetByIdAsync(fromTaskId) ?? throw new KeyNotFoundException($"Task with Id '{fromTaskId}' not found.");
        var ToTask = await _taskRepository.GetByIdAsync(ToTaskId) ?? throw new KeyNotFoundException($"Task with Id '{ToTaskId}' not found.");
        var taskRelation = await _relationTypeRepository.GetByIdAsync(TaskRelationId) ?? throw new KeyNotFoundException($"Task relation with Id '{TaskRelationId}' not found.");

        await _taskDomainService.AddCustomRelation(fromTaskId, ToTaskId, taskRelation.Id);

        // Save changes
        await _taskRepository.UpdateAsync(fromTask);
        await _taskRepository.UpdateAsync(ToTask); // don't need this, as not edited. But just in case of future changes
    }
}
