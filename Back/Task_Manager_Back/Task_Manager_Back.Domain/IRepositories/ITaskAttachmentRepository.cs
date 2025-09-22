using System;
using Task_Manager_Back.Domain.Entities.TaskRelated;

namespace Task_Manager_Back.Domain.IRepositories;

public interface ITaskAttachmentRepository
{
    Task AddAsync(TaskAttachment taskAttachment);
    Task<TaskAttachment?> GetByIdAsync(Guid id);
    Task DeleteAsync(TaskAttachment taskAttachment);
}
