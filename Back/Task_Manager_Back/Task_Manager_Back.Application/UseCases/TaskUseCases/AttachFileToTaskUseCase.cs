using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task_Manager_Back.Domain.Entities.TaskRelated;
using Task_Manager_Back.Domain.IRepositories;

namespace Task_Manager_Back.Application.UseCases.TaskUseCases;
// TODO: implement AttachFileToTaskUseCase
public class AttachFileToTaskUseCase
{
    private readonly ITaskRepository _taskRepository;
    private readonly ITaskAttachmentRepository _taskAttachmentRepository;
    public AttachFileToTaskUseCase(ITaskRepository taskRepository, ITaskAttachmentRepository taskAttachmentRepository)
    {
        _taskRepository = taskRepository;
        _taskAttachmentRepository = taskAttachmentRepository;
    }
    public async Task ExecuteAsync(Guid UserId, Guid taskId, string filePath, string fileType, string? fileName = null)
    {
        TaskEntity task = await _taskRepository.GetByIdAsync(taskId) ?? throw new KeyNotFoundException($"Task with Id '{taskId}' not found.");
        if (task.UserId != UserId)
            throw new UnauthorizedAccessException("You do not have permission to attach files to this task.");
        TaskAttachment taskAttachment = new TaskAttachment(UserId, taskId, filePath, fileType, fileName);
        await _taskAttachmentRepository.AddAsync(taskAttachment);
    }
}
