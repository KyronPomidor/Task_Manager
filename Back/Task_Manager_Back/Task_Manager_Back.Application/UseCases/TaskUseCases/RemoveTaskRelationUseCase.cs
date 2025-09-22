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

// removes a relation between two tasks. use Domain Service.
public class RemoveTaskRelationUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly IRelationTypeRepository _relationTypeRepository;
    private readonly TaskDomainService _taskDomainService;
    public RemoveTaskRelationUseCase(ITaskRepository taskRepository, IRelationTypeRepository relationTypeRepository, TaskDomainService taskDomainService)
    {
        _taskRepository = taskRepository;
        _relationTypeRepository = relationTypeRepository;
        _taskDomainService = taskDomainService;
    }
    public async Task ExecuteAsync(Guid fromTaskId, Guid ToTaskId, Guid RelationTypeId)
    {
        var fromTask = await _taskRepository.GetByIdAsync(fromTaskId) ?? throw new KeyNotFoundException($"Task with Id '{fromTaskId}' not found.");
        var ToTask = await _taskRepository.GetByIdAsync(ToTaskId) ?? throw new KeyNotFoundException($"Task with Id '{ToTaskId}' not found.");
        var relationType = await _relationTypeRepository.GetByIdAsync(RelationTypeId);

        if (relationType == null)
            throw new KeyNotFoundException($"Relation type with Id '{RelationTypeId}' not found.");

        await _taskDomainService.DeleteCustomRelation(fromTaskId, ToTaskId, RelationTypeId);

        // save changes
        await _taskRepository.UpdateAsync(fromTask);
        await _taskRepository.UpdateAsync(ToTask); // don't need this, as not edited. But just in case of future changes
    }
}
