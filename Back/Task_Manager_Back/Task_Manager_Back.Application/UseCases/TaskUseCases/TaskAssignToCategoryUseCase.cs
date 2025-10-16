using System;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;

public class TaskAssignToCategoryUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly ITaskCategoryRepository _categoryRepository;

    public TaskAssignToCategoryUseCase(ITaskRepository taskRepository, ITaskCategoryRepository categoryRepository)
    {
        _taskRepository = taskRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task ExecuteAsync(Guid taskId, Guid? targetCategoryId) //Null means Inbox
    {
        var task = await _taskRepository.GetByIdAsync(taskId) ?? throw new KeyNotFoundException($"Task with Id '{taskId}' not found.");
        if (targetCategoryId is null)
        {
            task.AssignToInboxCategory(); //wtf am I doing?
            await _taskRepository.UpdateAsync(task);
            return;
        }
        var targetCategory = await _categoryRepository.GetByIdAsync(targetCategoryId.Value) ?? throw new KeyNotFoundException($"Category with Id '{targetCategoryId}' not found.");

        // Move the task to the target category
        task.AssignToCategory(targetCategory.Id); //need to change to call the Domain Service

        // Save changes
        await _taskRepository.UpdateAsync(task);
    }

}
